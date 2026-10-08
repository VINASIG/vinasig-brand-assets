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

const revision = "4d22d543fdb69b2e8b7765f5f543c80e42fb2356";
await test("the static build preserves source bytes, uses the repository base and rebuilds identically", async () => {
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
    assert(html.includes(siteOrigin + route(language)));
    assert.equal((html.match(/data-copy-hex=/g) ?? []).length, 46);
    assert.equal((html.match(/data-site-header/g) ?? []).length, 1);
    assert.equal((html.match(/data-site-footer/g) ?? []).length, 1);
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
