import assert from "node:assert/strict";
import {
  appendFile,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  stat,
  symlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { verifyAssets } from "../scripts/check-assets.ts";
import { verifyStandards } from "../scripts/check-standards.ts";
import {
  localPath,
  parseJson,
  record,
  repositoryRoot,
  text,
} from "../scripts/local.ts";

async function fixture(): Promise<string> {
  const parent = await localPath(repositoryRoot, "output/tests", true);
  await mkdir(parent, { recursive: true });
  const root = await mkdtemp(path.join(parent, "integrity-"));
  for (const folder of [
    "01_Logos",
    "02_Typography",
    "99_Evidence",
    "assets",
    ".agents",
    ".vinasig/standards",
  ]) {
    await mkdir(path.dirname(path.join(root, folder)), { recursive: true });
    await cp(path.join(repositoryRoot, folder), path.join(root, folder), {
      recursive: true,
    });
  }
  for (const file of [
    "asset-catalog.json",
    "VINASIG_Logo_Story.md",
    "AGENTS.md",
    ".vinasig/manifest.json",
    ".vinasig/provenance.json",
  ]) {
    await cp(path.join(repositoryRoot, file), path.join(root, file));
  }
  return root;
}

async function alterCatalog(
  root: string,
  change: (
    catalog: Record<string, unknown>,
    assets: Record<string, unknown>[],
  ) => void,
): Promise<void> {
  const catalog = record(
    parseJson(await readFile(path.join(root, "asset-catalog.json"))),
  );
  const values = catalog["assets"];
  assert(Array.isArray(values));
  const assets = (values as unknown[]).map(record);
  change(catalog, assets);
  catalog["assets"] = assets;
  await writeFile(
    path.join(root, "asset-catalog.json"),
    `${JSON.stringify(catalog, null, 2)}\n`,
  );
}

await test("the current archive and core snapshot pass their integrity gates", async () => {
  const assets = await verifyAssets();
  assert.equal(assets.assets, 50);
  assert.equal(assets.originalAssets, 48);
  assert.equal(assets.historicalEntries, 49);
  assert.equal(assets.correctedCopies, 2);
  assert.equal(assets.checksums.length, 51);
  assert(
    assets.checksums.every(
      (line) => !line.includes(".git/") && !line.includes("output/"),
    ),
  );
  const standards = await verifyStandards();
  assert.equal(standards.files, 18);
  assert.equal(standards.runtimeDiscovery, "NOT_RUN");
});

await test("changed original artwork is rejected", async () => {
  const root = await fixture();
  await appendFile(
    path.join(root, "01_Logos/Favicon/Exports/VINASIG Favicon - 16x16.png"),
    "changed",
  );
  await assert.rejects(verifyAssets(root), /Asset size changed/);
});

await test("a missing font notice is rejected", async () => {
  const root = await fixture();
  await rename(
    path.join(root, "02_Typography/Space Grotesk/OFL.txt"),
    path.join(root, "retained-test-notice.txt"),
  );
  await assert.rejects(verifyAssets(root), /ENOENT/);
});

await test("incorrect PNG dimensions are rejected despite a correct file checksum", async () => {
  const root = await fixture();
  await alterCatalog(root, (_catalog, assets) => {
    const asset = assets.find(
      (entry) => entry["path"] === "assets/contained-mark-54.png",
    );
    assert(asset);
    record(asset["pixels"])["width"] = 108;
  });
  await assert.rejects(verifyAssets(root), /PNG metadata differs/);
});

await test("incorrect variable-font metadata is rejected", async () => {
  const root = await fixture();
  await alterCatalog(root, (_catalog, assets) => {
    const asset = assets.find((entry) => entry["format"] === "ttf");
    assert(asset);
    record(asset["font"])["weight"] = 900;
  });
  await assert.rejects(verifyAssets(root), /Font metadata differs/);
});

await test("a duplicate catalog entry is rejected", async () => {
  const root = await fixture();
  await alterCatalog(root, (catalog, assets) => {
    const first = assets[0];
    assert(first);
    assets.push({ ...first });
    catalog["assetCount"] = assets.length;
  });
  await assert.rejects(verifyAssets(root), /duplicated asset ID/);
});

await test("an unlisted asset is rejected", async () => {
  const root = await fixture();
  await writeFile(path.join(root, "assets/unreviewed.txt"), "unreviewed");
  await assert.rejects(verifyAssets(root), /Catalog does not cover/);
});

await test("catalog path traversal is rejected before reading the target", async () => {
  const root = await fixture();
  await alterCatalog(root, (_catalog, assets) => {
    const first = assets[0];
    assert(first);
    first["path"] = "../outside.png";
  });
  await assert.rejects(verifyAssets(root), /Unsafe path/);
});

await test("an asset junction or symlink is rejected", async () => {
  const root = await fixture();
  await symlink(
    path.join(root, "assets"),
    path.join(root, "01_Logos/linked-assets"),
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(
    verifyAssets(root),
    /Unsupported asset entry|Symlink boundary/,
  );
});

await test("historical checksum evidence cannot be regenerated silently", async () => {
  const root = await fixture();
  await appendFile(
    path.join(root, "99_Evidence/SHA256SUMS.txt"),
    "\nmodified evidence\n",
  );
  await assert.rejects(verifyAssets(root), /Preserved record changed/);
});

await test("a corrected copy must identify its exact archival source", async () => {
  const root = await fixture();
  await alterCatalog(root, (_catalog, assets) => {
    const asset = assets.find(
      (entry) => entry["path"] === "assets/contained-mark-54.png",
    );
    assert(asset);
    asset["derivedFrom"] =
      "01_Logos/Contained Mark/Exports/VINASIG Contained Brand Mark - 2x - 54x54.png";
  });
  await assert.rejects(verifyAssets(root), /Corrected copy source differs/);
});

await test("managed policy tampering is rejected", async () => {
  const root = await fixture();
  await appendFile(
    path.join(root, ".vinasig/standards/policies/language.md"),
    "\nmodified snapshot\n",
  );
  await assert.rejects(verifyStandards(root), /Snapshot integrity failed/);
});

await test("manifest tampering is rejected against owner provenance", async () => {
  const root = await fixture();
  await appendFile(path.join(root, ".vinasig/manifest.json"), "\n");
  await assert.rejects(
    verifyStandards(root),
    /Manifest differs from reviewed provenance/,
  );
});

await test("a root override cannot silently shadow the managed entrypoint", async () => {
  const root = await fixture();
  await writeFile(path.join(root, "AGENTS.override.md"), "shadow");
  await assert.rejects(verifyStandards(root), /Root override shadows/);
});

await test("owner instructions outside the managed block remain editable", async () => {
  const root = await fixture();
  await appendFile(
    path.join(root, "AGENTS.md"),
    "\nOwner note outside the managed block.\n",
  );
  await verifyStandards(root);
});

await test("managed instruction block tampering is rejected", async () => {
  const root = await fixture();
  const file = path.join(root, "AGENTS.md");
  const source = await readFile(file, "utf8");
  await writeFile(
    file,
    source.replace(
      "<!-- VINASIG STANDARDS BEGIN -->",
      "<!-- VINASIG STANDARDS BEGIN -->\nModified managed block.",
    ),
  );
  await assert.rejects(
    verifyStandards(root),
    /Managed instruction block differs/,
  );
});

await test("publication documentation links resolve inside the checkout", async () => {
  for (const file of [
    "README.md",
    "CONTRIBUTING.md",
    "SECURITY.md",
    "docs/assets.md",
    "docs/standards.md",
    "docs/toolchain.md",
    "docs/audits/publication-2026-10-03.md",
    "99_Evidence/README.md",
  ]) {
    const source = await readFile(path.join(repositoryRoot, file), "utf8");
    for (const match of source.matchAll(
      /\[[^\]]+\]\((?:<([^>]+)>|([^\s)]+))\)/g,
    )) {
      const target = text(match[1] ?? match[2]);
      if (/^https?:|^mailto:|^#/.test(target)) continue;
      const targetWithoutFragment = target.split("#")[0];
      assert(targetWithoutFragment);
      const resolved = path.resolve(
        path.dirname(path.join(repositoryRoot, file)),
        decodeURIComponent(targetWithoutFragment),
      );
      const relative = path.relative(repositoryRoot, resolved);
      assert(
        !relative.startsWith("..") && !path.isAbsolute(relative),
        `Link leaves checkout: ${file} ${target}`,
      );
      await stat(resolved);
    }
  }
});
