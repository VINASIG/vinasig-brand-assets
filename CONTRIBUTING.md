# Contributing

Read [AGENTS.md](AGENTS.md), [the asset guide](docs/assets.md), [the rights notice](ASSET_RIGHTS.md) and the installed `core` profile before changing this archive. Public visibility does not authorize reuse or redesign of the artwork.

## Preservation

- Preserve original file paths and bytes in `01_Logos`, `02_Typography` and the immutable evidence records.
- Make a new export a separate file. Record its source, purpose, actual metadata and checksum in `asset-catalog.json` after reviewing the output.
- Preserve the original Space Grotesk notice and third-party attribution. Do not add a general logo or source license as a documentation fix.
- Treat source canvases as history. An eliminated study is not a current export.
- Keep reports, temporary fixtures, bundles and installer backups in ignored locations. Do not publish machine paths, private captures or credentials.

## Tooling changes

Use the pinned Node and npm versions described in [the toolchain record](docs/toolchain.md).

```sh
npx --yes npm@12.2.0 ci --ignore-scripts
npm run check
npm test
```

Exercise relevant negative cases when modifying an integrity gate. Do not overwrite `99_Evidence/SHA256SUMS.txt` to accept a changed file. A deliberate archive revision needs its own reviewed change record and checks. Use the standards installer to change managed instructions; see [standards adoption](docs/standards.md).

Before an authorized commit, inspect Git status and the staged diff, including binary paths. Push the current branch and verify the exact commit's CI. Changing visibility, tags, releases, asset rights or external accounts requires the user's task authorization. Keep changes focused and use concise English commit subjects.

Report ordinary catalog or documentation defects in [repository issues](https://github.com/VINASIG/vinasig-brand-assets/issues). Use [the security policy](SECURITY.md) for sensitive findings.

## Contribution licensing

Read [LICENSES.md](LICENSES.md) before submitting material. New contributions use the applicable software, documentation or data scope unless a different compatible license is explicitly identified and accepted. Preserve authorship and third-party notices. Submit only material you have authority to license. This does not require a blanket copyright assignment or grant permission to redesign the official identity assets.
