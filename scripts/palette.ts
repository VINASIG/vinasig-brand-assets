import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { format } from "prettier";
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
  text,
  writeOutput,
} from "./local.ts";

type Group = "identity" | "support" | "neutral" | "deep";
interface Background {
  id: string;
  name: string;
  nameVi: string;
  token: string;
  hex: string;
}
export interface PaletteColor {
  id: string;
  name: string;
  nameVi: string;
  group: Group;
  foreground?: string;
  token?: string;
  backgrounds: Background[];
}
export interface Palette {
  reviewedOn: string;
  colors: PaletteColor[];
}

const paletteIds = [
  "scout-blue",
  "thinker-orange",
  "builder-green",
  "auditor-red",
  "core-graphite",
  "clay",
  "saffron",
  "lagoon",
  "violet",
  "sky",
  "porcelain",
  "fog",
  "stone",
  "slate",
  "ink",
  "paper",
  "indigo-deep",
  "forest-deep",
  "ocean-deep",
  "burgundy-deep",
  "plum-deep",
  "amber-deep",
  "cobalt-deep",
  "meadow-deep",
  "glacier-deep",
  "rose-deep",
  "orchid-deep",
  "sunlight-deep",
  "citron-deep",
];
const identity: Readonly<Record<string, string>> = {
  "scout-blue": "#21497B",
  "thinker-orange": "#EB7114",
  "builder-green": "#47A036",
  "auditor-red": "#971607",
  "core-graphite": "#443A3B",
};
const sourceUrl =
  "https://minecraft.fandom.com/wiki/Formatting_codes#Color_codes";
const outputs = ["assets/palette.svg", "docs/palette-reference.md"];

export function rgb(hex: string): number[] {
  assert.match(hex, /^#[0-9A-F]{6}$/, "Expected an uppercase sRGB Hex value");
  return [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
}

function luminance(hex: string): number {
  const weights = [0.2126, 0.7152, 0.0722];
  return rgb(hex).reduce((sum, channel, index) => {
    const value = channel / 255;
    const linear =
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    return sum + linear * (weights[index] ?? 0);
  }, 0);
}

export function contrast(first: string, second: string): number {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  const light = values[0];
  const dark = values[1];
  assert(light !== undefined && dark !== undefined);
  return (light + 0.05) / (dark + 0.05);
}

export function parsePalette(value: unknown): Palette {
  const document = record(value);
  assert.equal(document["format"], 2, "Unsupported palette format");
  const reviewedOn = text(document["reviewedOn"]);
  assert.match(reviewedOn, /^\d{4}-\d{2}-\d{2}$/);
  const source = record(document["source"]);
  assert.equal(source["url"], sourceUrl, "Unexpected palette source");
  checksum(source["submittedHtmlSha256"]);
  assert.equal(source["inspiration"], "Palette inspired by Minecraft.");
  assert.equal(
    source["previousRevision"],
    "5fc143f20ac758a2584fa9d59482526456c78efb",
  );
  assert.equal(
    source["previousPaletteSha256"],
    "069b4b4bfb3c7cc131026f1cc122596ca47dbe4536cc99428f91968512d10002",
  );
  const values = document["colors"];
  assert(Array.isArray(values), "Expected a palette color list");
  const colors = (values as unknown[]).map((candidate): PaletteColor => {
    const color = record(candidate);
    const id = text(color["id"]);
    const name = text(color["name"]);
    const nameVi = text(color["nameVi"]);
    assert.match(nameVi, /^[\p{L} ]+$/u, "Invalid Vietnamese display name");
    const group = text(color["group"]);
    assert.match(id, /^[a-z]+(?:-[a-z]+)*$/, "Invalid palette ID");
    assert.match(name, /^[A-Za-z ]+$/, "Invalid palette display name");
    assert(
      !("code" in color) && !("sourceName" in color),
      "Use VINASIG identifiers only",
    );
    assert(
      group === "identity" ||
        group === "support" ||
        group === "neutral" ||
        group === "deep",
      "Invalid palette group",
    );
    const base =
      group === "deep"
        ? {}
        : {
            foreground: text(color["foreground"]),
            token: text(color["token"]),
          };
    if ("foreground" in base) {
      rgb(base.foreground);
      assert.equal(
        base.token,
        group === "identity" ? `--color-${id}` : `--color-palette-${id}`,
        "Invalid base token",
      );
    } else
      assert(
        !("foreground" in color) && !("token" in color),
        "Deep-only colors must not include excluded base colors",
      );
    const backgroundValues = color["backgrounds"];
    assert(Array.isArray(backgroundValues), "Expected Background values");
    const backgrounds = (backgroundValues as unknown[]).map(
      (candidateBackground): Background => {
        const background = record(candidateBackground);
        const toneId = text(background["id"]);
        const toneName = text(background["name"]);
        const toneNameVi = text(background["nameVi"]);
        assert.match(
          toneNameVi,
          /^[\p{L} ]+$/u,
          "Invalid Vietnamese deep name",
        );
        const token = text(background["token"]);
        const hex = text(background["hex"]);
        assert.match(toneName, /^[A-Za-z ]+$/, "Invalid deep display name");
        assert.equal(
          token,
          group === "identity"
            ? `--color-${toneId}`
            : `--color-palette-${toneId}`,
          "Invalid deep token",
        );
        rgb(hex);
        return { id: toneId, name: toneName, nameVi: toneNameVi, token, hex };
      },
    );
    assert.deepEqual(
      backgrounds.map((background) => background.id),
      id === "amber-deep"
        ? ["amber-olive-deep", "amber-umber-deep"]
        : [group === "deep" ? id : `${id}-deep`],
      "Missing or ambiguous deep tone",
    );
    return { id, name, nameVi, group, ...base, backgrounds };
  });
  assert.equal(new Set(colors.map((color) => color.id)).size, colors.length);
  assert.deepEqual(
    colors.map((color) => color.id),
    paletteIds,
    "Missing or duplicated palette ID",
  );
  assert.deepEqual(
    colors
      .filter((color) => color.group === "identity")
      .map((color) => color.id),
    Object.keys(identity),
    "Identity role set or order changed",
  );
  for (const [id, hex] of Object.entries(identity))
    assert.equal(
      colors.find((color) => color.id === id)?.foreground,
      hex,
      `Preserved identity color changed: ${id}`,
    );
  const conflicts = document["sourceConflicts"];
  assert(Array.isArray(conflicts) && conflicts.length === 2);
  for (const candidate of conflicts as unknown[]) {
    const conflict = record(candidate);
    const color = colors.find((entry) => entry.id === conflict["id"]);
    assert(color?.foreground, "Unknown source conflict ID");
    assert.equal(conflict["foregroundHex"], color.foreground);
    assert.deepEqual(
      conflict["resolvedForegroundRgb"],
      rgb(color.foreground),
      "Resolved source RGB differs from Hex",
    );
    assert.notDeepEqual(
      conflict["submittedForegroundRgb"],
      conflict["resolvedForegroundRgb"],
      "Source conflict must record an actual difference",
    );
  }
  const stats = statistics({ reviewedOn, colors });
  assert.deepEqual(
    stats,
    { selectedForegrounds: 16, backgrounds: 30, uniqueColors: 45 },
    "Selected palette inventory changed",
  );
  return { reviewedOn, colors };
}

export function statistics(palette: Palette) {
  const selected = palette.colors.filter((color) => color.group !== "deep");
  const backgrounds = palette.colors.flatMap((color) => color.backgrounds);
  return {
    selectedForegrounds: selected.length,
    backgrounds: backgrounds.length,
    uniqueColors: new Set([
      ...selected.flatMap((color) =>
        color.foreground ? [color.foreground] : [],
      ),
      ...backgrounds.map((background) => background.hex),
    ]).size,
  };
}

function swatch(x: number, y: number, width: number, hex: string): string {
  const ink = contrast(hex, "#FFFFFF") >= 4.5 ? "#FFFFFF" : "#000000";
  return `<rect x="${String(x)}" y="${String(y)}" width="${String(width)}" height="42" fill="${hex}" stroke="#CECACA" stroke-width="1"/><text x="${String(x + width / 2)}" y="${String(y + 27)}" fill="${ink}" font-size="18" text-anchor="middle">${hex}</text>`;
}

export function renderPalette(palette: Palette): string {
  const parts = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="1376" viewBox="0 0 1120 1376" role="img" aria-labelledby="title description">',
    '<title id="title">VINASIG color palette</title>',
    '<desc id="description">Five preserved identity colors, supporting colors, neutrals and deep tones. Paired swatches are color references, not approved text and background combinations.</desc>',
    '<rect width="1120" height="1376" fill="#FFFFFF"/>',
    '<g font-family="Space Grotesk, Arial, sans-serif" fill="#443A3B">',
    '<text x="32" y="49" font-size="32" font-weight="700">VINASIG color palette</text>',
    '<text x="32" y="80" font-size="17">Upper swatch is Base. Lower swatch is Deep.</text>',
  ];
  const sections: {
    group: Group;
    title: string;
    y: number;
    columns: number;
  }[] = [
    { group: "identity", title: "Identity colors", y: 125, columns: 5 },
    { group: "support", title: "Supporting colors", y: 345, columns: 5 },
    {
      group: "neutral",
      title: "Neutral colors and surfaces",
      y: 565,
      columns: 6,
    },
  ];
  for (const section of sections) {
    parts.push(
      `<text x="32" y="${String(section.y)}" font-size="22" font-weight="700">${section.title}</text>`,
    );
    const width = Math.floor(
      (1056 - 16 * (section.columns - 1)) / section.columns,
    );
    palette.colors
      .filter((color) => color.group === section.group)
      .forEach((color, index) => {
        const x = 32 + index * (width + 16);
        const y = section.y + 34;
        const background = color.backgrounds[0];
        assert(background);
        parts.push(
          `<text x="${String(x)}" y="${String(y)}" font-size="17" font-weight="700">${color.name}</text>`,
          swatch(x, y + 15, width, color.foreground ?? ""),
          swatch(x, y + 63, width, background.hex),
        );
      });
  }
  parts.push(
    '<text x="32" y="785" font-size="22" font-weight="700">Additional deep tones</text>',
    '<text x="32" y="813" font-size="17">Reference tones for contexts that need darker colors.</text>',
  );
  palette.colors
    .filter((color) => color.group === "deep")
    .flatMap((color) =>
      color.backgrounds.map((background) => ({ color, background })),
    )
    .forEach(({ background }, index) => {
      const x = 32 + (index % 4) * 268;
      const y = 853 + Math.floor(index / 4) * 110;
      parts.push(
        `<text x="${String(x)}" y="${String(y)}" font-size="17">${background.name}</text>`,
        swatch(x, y + 13, 252, background.hex),
      );
    });
  const counts = statistics(palette);
  parts.push(
    `<text x="32" y="1336" font-size="17">${String(counts.selectedForegrounds)} base colors, ${String(counts.backgrounds)} deep tones, ${String(counts.uniqueColors)} distinct sRGB colors.</text>`,
    `<text x="32" y="1361" font-size="15">Reviewed ${palette.reviewedOn}. See docs/colors.md for source decisions and text contrast.</text>`,
    "</g></svg>",
  );
  return `${parts.join("\n")}\n`;
}

export function renderReference(palette: Palette): string {
  const parts = [
    "# VINASIG palette reference",
    "",
    "Generated from [palette.json](../assets/palette.json). Names, Hex values and CSS tokens are shared with the Web Design System. RGB is derived from Hex.",
    "",
    "## Base colors",
    "",
    "| Name | Group | Hex | RGB | CSS token |",
    "| --- | --- | --- | --- | --- |",
  ];
  for (const color of palette.colors)
    if (color.foreground && color.token)
      parts.push(
        `| ${color.name} | ${color.group} | \`${color.foreground}\` | ${rgb(color.foreground).join(", ")} | \`${color.token}\` |`,
      );
  parts.push(
    "",
    "## Deep tones",
    "",
    "| Name | Hex | RGB | CSS token |",
    "| --- | --- | --- | --- |",
  );
  for (const color of palette.colors)
    for (const tone of color.backgrounds)
      parts.push(
        `| ${tone.name} | \`${tone.hex}\` | ${rgb(tone.hex).join(", ")} | \`${tone.token}\` |`,
      );
  parts.push(
    "",
    "## Base and deep contrast",
    "",
    "These measurements describe actual sRGB pairs. They do not recommend using every base color as text on its corresponding deep tone. Normal text needs at least 4.5 to 1. Decisions use the unrounded ratio.",
    "",
    "| Name | Base | Deep | Contrast | AA normal text |",
    "| --- | --- | --- | --- | --- |",
  );
  for (const color of palette.colors)
    if (color.foreground)
      for (const tone of color.backgrounds) {
        const ratio = contrast(color.foreground, tone.hex);
        parts.push(
          `| ${color.name} | \`${color.foreground}\` | \`${tone.hex}\` | ${(Math.floor(ratio * 100) / 100).toFixed(2)} | ${ratio >= 4.5 ? "PASS" : "FAIL"} |`,
        );
      }
  parts.push("", "Palette inspired by Minecraft.", "");
  return parts.join("\n");
}

export async function verifyPalette(directory = repositoryRoot, write = false) {
  const root = await directoryRoot(directory);
  const palette = parsePalette(
    parseJson(await readLocal(root, "assets/palette.json")),
  );
  const rendered = [
    renderPalette(palette),
    await format(renderReference(palette), { parser: "markdown" }),
  ];
  const hashes: Record<string, string> = {};
  for (const [index, relative] of outputs.entries()) {
    const value = rendered[index];
    assert(value !== undefined);
    if (write)
      await writeFile(await localPath(root, relative, true), value, "utf8");
    else
      assert.equal(
        (await readLocal(root, relative)).toString("utf8"),
        value,
        `Palette export differs from its source: ${relative}`,
      );
    hashes[relative] = digest(value);
  }
  const result = { status: "PASS", ...statistics(palette), hashes };
  await writeOutput(
    root,
    "output/checks/palette.json",
    `${JSON.stringify(result, null, 2)}\n`,
  );
  return result;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    assert(
      process.argv.length === 3 &&
        (process.argv[2] === "--check" || process.argv[2] === "--write"),
      "Use --check or --write. Catalog digests are never updated by this tool.",
    );
    console.log(
      JSON.stringify(
        await verifyPalette(repositoryRoot, process.argv[2] === "--write"),
      ),
    );
  } catch (error) {
    console.error(`Palette check failed: ${message(error)}`);
    process.exitCode = 1;
  }
}
