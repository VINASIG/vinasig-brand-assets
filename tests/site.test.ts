import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { format } from "prettier";
import {
  buildSite,
  route,
  siteBase,
  siteOrigin,
} from "../scripts/build-site.ts";
import { digest, parseJson, record, repositoryRoot } from "../scripts/local.ts";
import { parsePalette } from "../scripts/palette.ts";

const revision = "4d22d543fdb69b2e8b7765f5f543c80e42fb2356";
await test("the static build preserves source bytes, uses the canonical domain root and rebuilds identically", async () => {
  assert.equal(siteOrigin, "https://brand.vinasig.io.vn");
  assert.equal(siteBase, "/");
  const firstRoot = path.join(repositoryRoot, "output/tests/site-first");
  const secondRoot = path.join(repositoryRoot, "output/tests/site-second");
  const first = await buildSite(revision, firstRoot);
  const second = await buildSite(revision, secondRoot);
  assert.deepEqual(first, second);
  const recordBytes = await readFile(path.join(firstRoot, "build-record.json"));
  assert.deepEqual(
    recordBytes,
    await readFile(path.join(secondRoot, "build-record.json")),
  );
  const result = record(parseJson(recordBytes));
  assert.equal(result["revision"], revision);
  assert.equal(result["site"], siteOrigin + siteBase);
  assert.deepEqual(result["files"], first);
  for (const file of ["palette.json", "palette.svg"])
    assert.equal(
      first[`downloads/${file}`],
      digest(await readFile(path.join(repositoryRoot, "assets", file))),
    );
  assert.equal(
    first["assets/palette.css"],
    digest(
      await readFile(path.join(repositoryRoot, "site/vendor/palette.css")),
    ),
  );
  const paletteCss = await readFile(
    path.join(firstRoot, "assets/palette.css"),
    "utf8",
  );
  const palette = parsePalette(
    parseJson(await readFile(path.join(repositoryRoot, "assets/palette.json"))),
  );
  const tones = palette.colors.flatMap((color) => [
    ...(color.foreground && color.token
      ? [{ token: color.token, hex: color.foreground }]
      : []),
    ...color.backgrounds,
  ]);
  assert.equal((paletteCss.match(/--color-[a-z-]+:/g) ?? []).length, 46);
  for (const tone of tones)
    assert(paletteCss.includes(`${tone.token}: ${tone.hex.toLowerCase()};`));
  assert(
    (
      await readFile(path.join(firstRoot, "assets/tokens.css"), "utf8")
    ).includes('@import "./palette.css";'),
  );
  for (const [source, emitted] of [
    [
      "01_Logos/Horizontal Lockup/Exports/VINASIG Primary Horizontal Lockup - Primary Color.svg",
      "assets/primary-color.svg",
    ],
    [
      "01_Logos/Horizontal Lockup/Exports/VINASIG Primary Horizontal Lockup - Reversed.svg",
      "assets/reversed.svg",
    ],
    [
      "02_Typography/Space Grotesk/fonts/variable/SpaceGrotesk-VariableFont_wght.ttf",
      "assets/fonts/SpaceGrotesk-VariableFont_wght.ttf",
    ],
    ["02_Typography/Space Grotesk/OFL.txt", "assets/fonts/OFL.txt"],
    ["LICENSES/AGPL-3.0-or-later.txt", "licenses/AGPL-3.0-or-later.txt"],
  ]) {
    assert(source && emitted);
    assert.equal(
      first[emitted],
      digest(await readFile(path.join(repositoryRoot, source))),
    );
  }
  for (const language of ["vi", "en"] as const) {
    const html = await readFile(
      path.join(firstRoot, language === "en" ? "en/index.html" : "index.html"),
      "utf8",
    );
    assert(html.includes(`lang="${language}"`));
    assert.match(
      html,
      language === "vi"
        ? /class="language-switch"[^>]*>\s*EN\s*<\/a\s*>/
        : /class="language-switch"[^>]*>\s*VI\s*<\/a\s*>/,
    );
    assert(html.includes(siteOrigin + route(language)));
    assert.equal((html.match(/data-copy-hex=/g) ?? []).length, 46);
    assert.equal((html.match(/data-site-header/g) ?? []).length, 1);
    assert.equal((html.match(/data-site-footer/g) ?? []).length, 1);
    assert(!html.includes(String.fromCodePoint(167)));
    assert(!/material_|Minecoin|Java|Bedrock/.test(html));
    assert.equal((html.match(/Minecraft/g) ?? []).length, 1);
    assert(!html.includes("http://") && !html.includes("localhost"));
    assert(
      !html.includes("99_Evidence/") && !html.includes("Source%20Canvases"),
    );
  }
});
await test("the builder rejects invalid revisions and output paths before writing", async () => {
  await assert.rejects(buildSite("main"), /complete source revision/);
  await assert.rejects(
    buildSite(revision, path.dirname(repositoryRoot)),
    /stay in this checkout/,
  );
  await assert.rejects(
    buildSite(revision, path.join(repositoryRoot, "01_Logos")),
    /Build only/,
  );
  await assert.rejects(
    buildSite(revision, path.join(repositoryRoot, "output")),
    /Build only/,
  );
});

await test("the preference fixture retains every upstream assertion while adapting the repository base", async () => {
  const upstream = await readFile(
    path.join(
      repositoryRoot,
      ".vinasig/standards/templates/web/shared-preferences.mjs",
    ),
    "utf8",
  );
  assert.equal(
    digest(upstream),
    "24e8ffe6b7ecab5cc13492e6f44745e0a798213fd48a1ec299d75e63746ffd96",
  );
  const adapted = upstream
    .replaceAll("originA + '/'", "originA + new URL(baseURL).pathname")
    .replaceAll("originB + '/'", "originB + new URL(baseURL).pathname")
    .replace(
      "if (viPath !== '/')",
      "if (viPath !== new URL(baseURL).pathname)",
    );
  const expected = await format(adapted, { parser: "babel" });
  assert.equal(
    await readFile(
      path.join(repositoryRoot, "tests/helpers/preferences.mjs"),
      "utf8",
    ),
    expected,
  );
});
