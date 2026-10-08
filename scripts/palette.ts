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

type Group = "identity" | "support" | "neutral" | "shadow";
type Edition = "unsplit" | "java" | "bedrock";
interface Background {
  edition: Edition;
  hex: string;
}
export interface PaletteColor {
  id: string;
  name: string;
  group: Group;
  code: string;
  sourceName: string;
  foreground: string;
  backgrounds: Background[];
}
export interface Palette {
  reviewedOn: string;
  colors: PaletteColor[];
}

const sourceCodes = Array.from("0123456789abcdefghijmnpqstuvw").map(
  (code) => `§${code}`,
);
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
  assert.equal(document["format"], 1, "Unsupported palette format");
  const reviewedOn = text(document["reviewedOn"]);
  assert.match(reviewedOn, /^\d{4}-\d{2}-\d{2}$/);
  const source = record(document["source"]);
  assert.equal(source["url"], sourceUrl, "Unexpected palette source");
  checksum(source["submittedHtmlSha256"]);
  const values = document["colors"];
  assert(Array.isArray(values), "Expected a palette color list");
  const colors = (values as unknown[]).map((candidate): PaletteColor => {
    const color = record(candidate);
    const id = text(color["id"]);
    const name = text(color["name"]);
    const code = text(color["code"]);
    const sourceName = text(color["sourceName"]);
    const group = text(color["group"]);
    const foreground = text(color["foreground"]);
    assert.match(id, /^[a-z]+(?:-[a-z]+)*$/, "Invalid palette ID");
    assert.match(name, /^[A-Za-z ]+$/, "Invalid palette display name");
    assert.match(sourceName, /^[a-z_]+$/, "Invalid source name");
    assert(
      group === "identity" ||
        group === "support" ||
        group === "neutral" ||
        group === "shadow",
      "Invalid palette group",
    );
    rgb(foreground);
    const backgroundValues = color["backgrounds"];
    assert(Array.isArray(backgroundValues), "Expected Background values");
    const backgrounds = (backgroundValues as unknown[]).map(
      (candidateBackground): Background => {
        const background = record(candidateBackground);
        const edition = text(background["edition"]);
        const hex = text(background["hex"]);
        assert(
          edition === "unsplit" || edition === "java" || edition === "bedrock",
          "Invalid Background edition",
        );
        rgb(hex);
        return { edition, hex };
      },
    );
    assert.deepEqual(
      backgrounds.map((background) => background.edition),
      code === "§6" ? ["java", "bedrock"] : ["unsplit"],
      "Missing or ambiguous Background edition",
    );
    return { id, name, group, code, sourceName, foreground, backgrounds };
  });
  assert.equal(new Set(colors.map((color) => color.id)).size, colors.length);
  assert.deepEqual(
    colors.map((color) => color.code).sort(),
    [...sourceCodes].sort(),
    "Missing or duplicated source code",
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
    const color = colors.find((entry) => entry.code === conflict["code"]);
    assert(color, "Unknown source conflict code");
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
  return { reviewedOn, colors };
}

export function statistics(palette: Palette) {
  const selected = palette.colors.filter((color) => color.group !== "shadow");
  const backgrounds = palette.colors.flatMap((color) => color.backgrounds);
  return {
    selectedForegrounds: selected.length,
    backgrounds: backgrounds.length,
    uniqueColors: new Set([
      ...selected.map((color) => color.foreground),
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
    '<desc id="description">Five preserved identity colors, supporting colors and neutrals with their Minecraft Background shadow values. Additional shadows retain both Gold edition variants. The paired swatches show provenance, not approved text/background combinations.</desc>',
    '<rect width="1120" height="1376" fill="#FFFFFF"/>',
    '<g font-family="Space Grotesk, Arial, sans-serif" fill="#443A3B">',
    '<text x="32" y="49" font-size="32" font-weight="700">VINASIG color palette</text>',
    '<text x="32" y="80" font-size="17">Upper swatch is Foreground. Lower swatch is Background, the source text-shadow color.</text>',
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
          swatch(x, y + 15, width, color.foreground),
          swatch(x, y + 63, width, background.hex),
          `<text x="${String(x)}" y="${String(y + 131)}" font-size="16">${color.code}</text>`,
        );
      });
  }
  parts.push(
    '<text x="32" y="785" font-size="22" font-weight="700">Additional Background colors</text>',
    '<text x="32" y="813" font-size="17">Their source Foreground colors are excluded from the selected palette.</text>',
  );
  palette.colors
    .filter((color) => color.group === "shadow")
    .flatMap((color) =>
      color.backgrounds.map((background) => ({ color, background })),
    )
    .forEach(({ color, background }, index) => {
      const x = 32 + (index % 4) * 268;
      const y = 853 + Math.floor(index / 4) * 110;
      const edition =
        background.edition === "java"
          ? " - Java"
          : background.edition === "bedrock"
            ? " - Bedrock"
            : "";
      parts.push(
        `<text x="${String(x)}" y="${String(y)}" font-size="17">${color.name}${edition}</text>`,
        swatch(x, y + 13, 252, background.hex),
        `<text x="${String(x)}" y="${String(y + 77)}" font-size="15">${color.code}</text>`,
      );
    });
  const counts = statistics(palette);
  parts.push(
    `<text x="32" y="1336" font-size="17">${String(counts.selectedForegrounds)} selected Foreground values, ${String(counts.backgrounds)} Background values, ${String(counts.uniqueColors)} distinct sRGB colors.</text>`,
    `<text x="32" y="1361" font-size="15">Reviewed ${palette.reviewedOn}. See docs/colors.md for source decisions and text contrast.</text>`,
    "</g></svg>",
  );
  return `${parts.join("\n")}\n`;
}

function editionLabel(edition: Edition): string {
  return edition === "java"
    ? "Java"
    : edition === "bedrock"
      ? "Bedrock"
      : "Source row";
}

export function renderReference(palette: Palette): string {
  const parts = [
    "# VINASIG palette reference",
    "",
    "Generated from [palette.json](../assets/palette.json) by [the palette renderer](../scripts/palette.ts). Read [selection and use](colors.md) before choosing colors. RGB values are derived from Hex. Background means the source text-shadow color.",
    "",
    "## Selected Foreground values and corresponding Background values",
    "",
    "| Name | Group | Source code | Foreground | Foreground RGB | Background | Background RGB |",
    "| --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const color of palette.colors.filter(
    (entry) => entry.group !== "shadow",
  ))
    for (const background of color.backgrounds)
      parts.push(
        `| ${color.name} | ${color.group} | \`${color.code}\` | \`${color.foreground}\` | ${rgb(color.foreground).join(", ")} | \`${background.hex}\` | ${rgb(background.hex).join(", ")} |`,
      );
  parts.push(
    "",
    "## Additional Background values",
    "",
    "Excluded Foreground values remain in the source JSON for traceability. They are not selected palette colors. Edition labels distinguish the two Gold shadow values. Source row means no edition split is needed for that value, not that its code is supported by every Minecraft edition.",
    "",
    "| Name | Source code | Source name | Background | Background RGB | Edition |",
    "| --- | --- | --- | --- | --- | --- |",
  );
  for (const color of palette.colors.filter(
    (entry) => entry.group === "shadow",
  ))
    for (const background of color.backgrounds)
      parts.push(
        `| ${color.name} | \`${color.code}\` | \`${color.sourceName}\` | \`${background.hex}\` | ${rgb(background.hex).join(", ")} | ${editionLabel(background.edition)} |`,
      );
  parts.push(
    "",
    "## Matched source-pair contrast",
    "",
    "These measurements compare selected source Foreground values with their corresponding Background values. They do not recommend using every pair. Threshold decisions use the unrounded ratio. Displayed ratios are truncated to two decimals. AA normal text requires at least 4.5 to 1. Large text and required non-text boundaries need separate context checks.",
    "",
    "| Name | Foreground | Background | Contrast | AA normal text |",
    "| --- | --- | --- | --- | --- |",
  );
  for (const color of palette.colors.filter(
    (entry) => entry.group !== "shadow",
  ))
    for (const background of color.backgrounds) {
      const ratio = contrast(color.foreground, background.hex);
      parts.push(
        `| ${color.name} | \`${color.foreground}\` | \`${background.hex}\` | ${(Math.floor(ratio * 100) / 100).toFixed(2)} | ${ratio >= 4.5 ? "PASS" : "FAIL"} |`,
      );
    }
  parts.push(
    "",
    `Source values are from the [owner-supplied Minecraft color table](${sourceUrl}). Selection, names and formatting are adapted for VINASIG. The two source RGB conflicts are retained in palette.json. This reference does not certify current game implementation values or Mojang endorsement.`,
    "",
  );
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
