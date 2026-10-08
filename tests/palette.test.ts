import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { parseJson, record, repositoryRoot } from "../scripts/local.ts";
import {
  contrast,
  parsePalette,
  renderPalette,
  rgb,
  statistics,
  verifyPalette,
} from "../scripts/palette.ts";

async function data(): Promise<Record<string, unknown>> {
  return record(
    parseJson(await readFile(path.join(repositoryRoot, "assets/palette.json"))),
  );
}

function colorRecords(document: Record<string, unknown>) {
  const colors = document["colors"];
  assert(Array.isArray(colors));
  return (colors as unknown[]).map(record);
}

await test("the expanded palette and both deterministic exports agree", async () => {
  const palette = parsePalette(await data());
  assert.deepEqual(statistics(palette), {
    selectedForegrounds: 16,
    backgrounds: 30,
    uniqueColors: 45,
  });
  const result = await verifyPalette();
  assert.equal(result.status, "PASS");
  assert.equal(Object.keys(result.hashes).length, 2);
  const svg = renderPalette(palette);
  assert(!svg.includes("#55FF55"));
  assert(svg.includes('fill="#153F15"'));
  assert(svg.includes("Gold Shadow - Java"));
  assert(svg.includes("Gold Shadow - Bedrock"));
});

await test("conflicting source RGB is resolved from the preserved identity Hex", () => {
  assert.deepEqual(rgb("#47A036"), [71, 160, 54]);
  assert.deepEqual(rgb("#EB7114"), [235, 113, 20]);
});

await test("WCAG contrast extremes, symmetry and actual text choices are checked", () => {
  assert.equal(contrast("#000000", "#FFFFFF"), 21);
  assert.equal(contrast("#21497B", "#21497B"), 1);
  assert.equal(contrast("#21497B", "#E3D4D1"), contrast("#E3D4D1", "#21497B"));
  assert(contrast("#443A3B", "#FFFFFF") >= 4.5);
  assert(contrast("#21497B", "#E3D4D1") >= 4.5);
  assert(contrast("#EB7114", "#FFFFFF") < 4.5);
  assert(contrast("#47A036", "#FFFFFF") < 4.5);
  assert(contrast("#971607", "#110E0E") < 4.5);
  assert(contrast("#000000", "#EB7114") >= 4.5);
  assert(contrast("#000000", "#47A036") >= 4.5);
});

await test("malformed colors and SVG markup cannot enter an export", async () => {
  const document = await data();
  const color = colorRecords(document)[5];
  assert(color);
  color["foreground"] = 'url("https://example.invalid/pixel")';
  assert.throws(() => parsePalette(document), /sRGB Hex/);
  color["foreground"] = "#B4684D";
  color["name"] = '<script>alert("test")</script>';
  assert.throws(() => parsePalette(document), /display name/);
});

await test("a retained identity color cannot be silently changed", async () => {
  const document = await data();
  const color = colorRecords(document)[0];
  assert(color);
  color["foreground"] = "#08121E";
  assert.throws(
    () => parsePalette(document),
    /Preserved identity color changed/,
  );
});

await test("all source codes and both edition-specific Gold shadows are required", async () => {
  const document = await data();
  const colors = colorRecords(document);
  const gold = colors.find((color) => color["code"] === "§6");
  assert(gold);
  gold["backgrounds"] = [{ edition: "unsplit", hex: "#2A2A00" }];
  assert.throws(() => parsePalette(document), /Background edition/);
  gold["backgrounds"] = [
    { edition: "java", hex: "#2A2A00" },
    { edition: "bedrock", hex: "#402A00" },
  ];
  const first = colors[0];
  assert(first);
  first["code"] = "§v";
  assert.throws(() => parsePalette(document), /source code/);
});

await test("incorrect RGB correction metadata is rejected", async () => {
  const document = await data();
  const conflicts = document["sourceConflicts"];
  assert(Array.isArray(conflicts));
  const first = record(conflicts[0]);
  first["resolvedForegroundRgb"] = [17, 160, 54];
  assert.throws(() => parsePalette(document), /Resolved source RGB/);
});

await test("an altered export is rejected without accepting a new checksum", async () => {
  const parent = path.join(repositoryRoot, "output/tests");
  await mkdir(parent, { recursive: true });
  const root = await mkdtemp(path.join(parent, "palette-"));
  await mkdir(path.join(root, "assets"));
  await mkdir(path.join(root, "docs"));
  for (const file of [
    "assets/palette.json",
    "assets/palette.svg",
    "docs/palette-reference.md",
  ])
    await cp(path.join(repositoryRoot, file), path.join(root, file));
  await writeFile(path.join(root, "assets/palette.svg"), "altered");
  await assert.rejects(verifyPalette(root), /Palette export differs/);
});
