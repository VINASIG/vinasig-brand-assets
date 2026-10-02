import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  checksum,
  digest,
  directoryRoot,
  localPath,
  message,
  parseJson,
  readLocal,
  record,
  repositoryRoot,
  safeRelative,
  text,
  writeOutput,
} from "./local.ts";

const preservedPaths = [
  "99_Evidence/CREATION_RECORD.md",
  "99_Evidence/FILE_INVENTORY.md",
  "99_Evidence/SHA256SUMS.txt",
  "99_Evidence/TERMINOLOGY_UPDATE_2026-10-02.md",
  "VINASIG_Logo_Story.md",
];
const initialStoryHash =
  "22cb8432eef45e4caf172cb778c2d5214c9ad7ab495a435d34f9fc4d757fbf9d";
const currentStoryHash =
  "e297ec5e40588b00d1b34a147f9346424a787c9fec1b5ef74698896bbd516fda";
const correctedSources: Readonly<Record<string, string>> = {
  "assets/contained-mark-54.png":
    "01_Logos/Contained Mark/Exports/VINASIG Contained Brand Mark - 4x - 108x108.png",
  "assets/contained-mark-108.png":
    "01_Logos/Contained Mark/Exports/VINASIG Contained Brand Mark - 2x - 54x54.png",
};

function positiveInteger(value: unknown): number {
  assert(
    typeof value === "number" && Number.isSafeInteger(value) && value > 0,
    "Expected a positive integer",
  );
  return value;
}

interface Axis {
  tag: string;
  minimum: number;
  default: number;
  maximum: number;
}
interface FontMetadata {
  family: string;
  weight: number;
  axes: Axis[];
}
interface CheckReport {
  status: "PASS";
  assets: number;
  originalAssets: number;
  historicalEntries: number;
  preservedRecords: number;
  correctedCopies: number;
  checksums: string[];
}

function fontMetadata(bytes: Buffer): FontMetadata {
  assert(
    bytes.length >= 12 && bytes.readUInt32BE(0) === 0x00010000,
    "Expected a TrueType font",
  );
  const tableCount = bytes.readUInt16BE(4);
  assert(12 + 16 * tableCount <= bytes.length, "Invalid TrueType directory");
  const tables = new Map<string, number>();
  for (let index = 0; index < tableCount; index++) {
    const directory = 12 + index * 16;
    const tag = bytes.toString("ascii", directory, directory + 4);
    const offset = bytes.readUInt32BE(directory + 8);
    const length = bytes.readUInt32BE(directory + 12);
    assert(offset + length <= bytes.length, `Invalid font table: ${tag}`);
    assert(!tables.has(tag), `Duplicate font table: ${tag}`);
    tables.set(tag, offset);
  }
  const os2 = tables.get("OS/2");
  const names = tables.get("name");
  assert(os2 !== undefined && names !== undefined, "Missing font metadata");
  const count = bytes.readUInt16BE(names + 2);
  const storage = names + bytes.readUInt16BE(names + 4);
  const families = new Set<string>();
  for (let index = 0; index < count; index++) {
    const start = names + 6 + index * 12;
    const platform = bytes.readUInt16BE(start);
    const nameId = bytes.readUInt16BE(start + 6);
    if ((platform === 0 || platform === 3) && (nameId === 1 || nameId === 16)) {
      const length = bytes.readUInt16BE(start + 8);
      const offset = storage + bytes.readUInt16BE(start + 10);
      assert(
        offset + length <= bytes.length && length % 2 === 0,
        "Invalid font name",
      );
      families.add(
        Buffer.from(bytes.subarray(offset, offset + length))
          .swap16()
          .toString("utf16le"),
      );
    }
  }
  assert(families.has("Space Grotesk"), "Unexpected font family");
  const axes: Axis[] = [];
  const variable = tables.get("fvar");
  if (variable !== undefined) {
    const start = variable + bytes.readUInt16BE(variable + 4);
    const axisCount = bytes.readUInt16BE(variable + 8);
    const axisSize = bytes.readUInt16BE(variable + 10);
    assert(
      axisSize >= 20 && start + axisSize * axisCount <= bytes.length,
      "Invalid variable font axes",
    );
    for (let index = 0; index < axisCount; index++) {
      const offset = start + axisSize * index;
      axes.push({
        tag: bytes.toString("ascii", offset, offset + 4),
        minimum: bytes.readInt32BE(offset + 4) / 65536,
        default: bytes.readInt32BE(offset + 8) / 65536,
        maximum: bytes.readInt32BE(offset + 12) / 65536,
      });
    }
  }
  return { family: "Space Grotesk", weight: bytes.readUInt16BE(os2 + 4), axes };
}

async function filesUnder(root: string, relative: string): Promise<string[]> {
  const results: string[] = [];
  for (const entry of await readdir(await localPath(root, relative), {
    withFileTypes: true,
  })) {
    const name = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) results.push(...(await filesUnder(root, name)));
    else if (entry.isFile()) results.push(name);
    else throw new Error(`Unsupported asset entry: ${name}`);
  }
  return results.sort();
}

export async function verifyAssets(
  directory = repositoryRoot,
): Promise<CheckReport> {
  const root = await directoryRoot(directory);
  const catalog = record(
    parseJson(await readLocal(root, "asset-catalog.json")),
  );
  assert.equal(catalog["format"], 1, "Unsupported catalog format");
  assert.equal(catalog["repository"], "VINASIG/vinasig-brand-assets");
  assert.equal(catalog["archiveVersion"], "1.0");
  assert.equal(
    catalog["preservationCommit"],
    "8c778ef3b5dd662fcdfdcde0f80f6a6da27d4a6e",
  );
  assert.match(text(catalog["reviewedOn"]), /^\d{4}-\d{2}-\d{2}$/);
  const preservation = record(catalog["preservedRecords"]);
  assert.deepEqual(
    Object.keys(preservation).sort(),
    [...preservedPaths].sort(),
    "Preservation record set differs",
  );
  for (const [relative, expected] of Object.entries(preservation)) {
    assert.equal(
      digest(await readLocal(root, relative)),
      checksum(expected),
      `Preserved record changed: ${relative}`,
    );
  }
  assert.equal(
    preservation["VINASIG_Logo_Story.md"],
    currentStoryHash,
    "Unreviewed story revision",
  );
  const entries = catalog["assets"];
  assert(Array.isArray(entries), "Missing asset list");
  assert.equal(
    entries.length,
    positiveInteger(catalog["assetCount"]),
    "Asset count differs",
  );
  const ids = new Set<string>();
  const assets = new Map<string, Record<string, unknown>>();
  const hashes = new Map<string, string>();
  const sums: string[] = [];
  for (const candidate of entries as unknown[]) {
    const entry = record(candidate);
    const id = text(entry["id"]);
    assert(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && !ids.has(id),
      `Invalid or duplicated asset ID: ${id}`,
    );
    ids.add(id);
    const relative = text(entry["path"]);
    safeRelative(relative);
    assert(
      /^(01_Logos|02_Typography|assets)\//.test(relative),
      `Unexpected asset root: ${relative}`,
    );
    assert(!assets.has(relative), `Duplicated asset path: ${relative}`);
    const bytes = await readLocal(root, relative);
    const expected = checksum(entry["sha256"]);
    assert.equal(
      bytes.length,
      positiveInteger(entry["bytes"]),
      `Asset size changed: ${relative}`,
    );
    assert.equal(
      digest(bytes),
      expected,
      `Asset checksum changed: ${relative}`,
    );
    const format = text(entry["format"]);
    assert.equal(
      path.posix.extname(relative),
      `.${format}`,
      `Asset format differs: ${relative}`,
    );
    const typography = relative.startsWith("02_Typography/");
    assert.equal(
      entry["rights"],
      typography ? "OFL-1.1" : "VINASIG-reserved",
      `Unexpected asset rights: ${relative}`,
    );
    const kind =
      format === "ttf"
        ? "font"
        : format === "txt"
          ? "font-license"
          : format === "png" || format === "svg"
            ? "logo-export"
            : relative.includes("/Source Canvases/")
              ? "archived-study"
              : "logo-source";
    assert.equal(entry["kind"], kind, `Asset kind differs: ${relative}`);
    assert(
      ["png", "svg", "ttf", "txt", "af", "aseprite"].includes(format),
      `Unsupported asset format: ${format}`,
    );
    if (format === "png") {
      assert(
        bytes.length >= 33 &&
          bytes
            .subarray(0, 8)
            .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
          bytes.toString("ascii", 12, 16) === "IHDR",
        `Invalid PNG: ${relative}`,
      );
      assert(
        bytes[25] === 2 || bytes[25] === 6,
        `Unexpected archived PNG color type: ${relative}`,
      );
      assert.deepEqual(
        entry["pixels"],
        {
          width: bytes.readUInt32BE(16),
          height: bytes.readUInt32BE(20),
          alphaChannel: bytes[25] === 6,
        },
        `PNG metadata differs: ${relative}`,
      );
    } else if (format === "svg") {
      const svg = bytes.toString("utf8");
      const match = /viewBox="([^"]+)"/.exec(svg);
      assert(match?.[1], `Missing SVG viewBox: ${relative}`);
      const viewBox = match[1].split(/\s+/).map(Number);
      assert(
        viewBox.length === 4 &&
          viewBox.every(Number.isFinite) &&
          (viewBox[2] ?? 0) > 0 &&
          (viewBox[3] ?? 0) > 0,
        `Invalid SVG viewBox: ${relative}`,
      );
      assert.deepEqual(
        entry["viewBox"],
        viewBox,
        `SVG metadata differs: ${relative}`,
      );
      assert(
        !/<script\b|<foreignObject\b|\bon[a-z]+\s*=|\b(?:xlink:)?href\s*=\s*["'](?!#)/i.test(
          svg,
        ),
        `Active or external SVG content: ${relative}`,
      );
    } else if (format === "ttf") {
      assert.deepEqual(
        entry["font"],
        fontMetadata(bytes),
        `Font metadata differs: ${relative}`,
      );
    } else if (format === "txt") {
      assert.equal(relative, "02_Typography/Space Grotesk/OFL.txt");
      assert(
        bytes.toString("utf8").includes("SIL OPEN FONT LICENSE Version 1.1"),
        "Missing font license notice",
      );
    }
    assets.set(relative, entry);
    hashes.set(relative, expected);
    sums.push(`${expected}  ${relative}`);
  }
  const allFiles = (
    await Promise.all(
      ["01_Logos", "02_Typography", "assets"].map((relative) =>
        filesUnder(root, relative),
      ),
    )
  )
    .flat()
    .sort();
  assert.deepEqual(
    [...assets.keys()].sort(),
    allFiles,
    "Catalog does not cover the actual asset files",
  );
  const historical = (await readLocal(root, "99_Evidence/SHA256SUMS.txt"))
    .toString("utf8")
    .trim()
    .split(/\r?\n/);
  assert.equal(historical.length, 49, "Historical inventory count differs");
  const historicPaths = new Set<string>();
  for (const line of historical) {
    const match = /^([a-f0-9]{64}) {2}(.+)$/.exec(line);
    assert(match?.[1] && match[2], "Malformed historical checksum");
    const relative = match[2];
    safeRelative(relative);
    assert(
      !historicPaths.has(relative),
      `Duplicated historical path: ${relative}`,
    );
    historicPaths.add(relative);
    if (relative === "VINASIG_Logo_Story.md")
      assert.equal(match[1], initialStoryHash);
    else
      assert.equal(
        hashes.get(relative),
        match[1],
        `Historical asset differs: ${relative}`,
      );
  }
  assert(
    historicPaths.has("VINASIG_Logo_Story.md"),
    "Historical story entry missing",
  );
  assert.deepEqual(
    [...assets.keys()]
      .filter((relative) => !relative.startsWith("assets/"))
      .sort(),
    [...historicPaths]
      .filter((relative) => relative !== "VINASIG_Logo_Story.md")
      .sort(),
    "Original asset set differs",
  );
  const terminology = (
    await readLocal(root, "99_Evidence/TERMINOLOGY_UPDATE_2026-10-02.md")
  ).toString("utf8");
  assert(
    terminology.includes(initialStoryHash) &&
      terminology.includes(currentStoryHash),
    "Story revision evidence missing",
  );
  for (const [relative, source] of Object.entries(correctedSources)) {
    const entry = assets.get(relative);
    assert(
      entry && entry["derivedFrom"] === source,
      `Corrected copy source differs: ${relative}`,
    );
    assert.equal(
      hashes.get(relative),
      hashes.get(source),
      `Corrected copy is not identical to its source: ${relative}`,
    );
    assert.deepEqual(
      entry["pixels"],
      assets.get(source)?.["pixels"],
      `Corrected copy dimensions differ: ${relative}`,
    );
  }
  for (const [relative, entry] of assets) {
    if (entry["derivedFrom"] !== undefined) {
      const source = text(entry["derivedFrom"]);
      assert(
        source !== relative && hashes.has(source),
        `Unknown corrected copy source: ${relative}`,
      );
      assert.equal(
        hashes.get(relative),
        hashes.get(source),
        `Corrected copy checksum differs: ${relative}`,
      );
    }
  }
  sums.push(`${currentStoryHash}  VINASIG_Logo_Story.md`);
  return {
    status: "PASS",
    assets: assets.size,
    originalAssets: historicPaths.size - 1,
    historicalEntries: historical.length,
    preservedRecords: preservedPaths.length,
    correctedCopies: Object.keys(correctedSources).length,
    checksums: sums.sort(),
  };
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const result = await verifyAssets();
    await writeOutput(
      repositoryRoot,
      "output/checks/assets.json",
      `${JSON.stringify(result, null, 2)}\n`,
    );
    await writeOutput(
      repositoryRoot,
      "output/checks/SHA256SUMS-current.txt",
      `${result.checksums.join("\n")}\n`,
    );
    console.log(
      `Asset integrity passed: ${String(result.assets)} assets, ${String(result.originalAssets)} unchanged originals, ${String(result.correctedCopies)} corrected copies. Reports: output/checks/.`,
    );
  } catch (error) {
    console.error(`Asset integrity failed: ${message(error)}`);
    process.exitCode = 1;
  }
}
