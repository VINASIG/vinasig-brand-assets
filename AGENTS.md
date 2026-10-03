# Work on VINASIG Brand Assets

Read README.md, ASSET_RIGHTS.md, docs/assets.md and the applicable installed VINASIG policy before editing.

- Preserve original artwork, fonts, font notices, source files and archival evidence byte for byte. Keep their paths stable. A new export or corrected filename must have an explicit source and a catalog entry; never overwrite an archival export to repair metadata.
- This is a public asset archive, not a web application or an npm product. Use the core standards profile. Web responsive, animation, SEO and browser flow audits are not applicable unless this repository gains a web interface.
- Use SI agents and Super Intelligence in new VINASIG descriptions. Keep public technical documentation, identifiers and commit subjects in English; answer the user in their language.
- Public visibility does not add a logo license. Preserve ASSET_RIGHTS.md and the original Space Grotesk OFL.txt. Do not assign personal authorship, add a general license, modify existing tags or publish a new release without task authorization.
- asset-catalog.json records actual file dimensions and digests. The two contained-mark PNG filename corrections live in assets/ and must remain identical to their explicitly recorded archival sources. Eliminated source canvases are historical studies, not recommended consumer assets.
- Keep 99_Evidence/SHA256SUMS.txt, FILE_INVENTORY.md, CREATION_RECORD.md, TERMINOLOGY_UPDATE_2026-10-02.md and VINASIG_Logo_Story.md unchanged. The historical story checksum differs by the already documented SI wording revision. Current checksum reports belong in ignored output/.
- Use npm with the pinned Node and package-manager versions. After tooling changes, run npm run check and npm test, including deliberate failure cases for integrity, paths and snapshot ownership. Never accept changed assets by regenerating a baseline automatically.
- Review Git status and staged diff before an authorized commit. Push the current branch, verify remote HEAD and CI for that commit, and distinguish publication from an asset rights grant. Keep local paths, tokens, dependencies, generated bundles and test fixtures out of Git.
- Imported .vinasig/standards/ files, .agents/skills/ files and the marked instruction block are managed snapshots. Use the reviewed installer for changes; do not edit or reformat those bytes manually.
<!-- VINASIG STANDARDS BEGIN -->
## VINASIG SI agent standards 0.1.0

Read `.vinasig/standards/policies/core.md` and `language.md` before repository work. Respect platform instructions, current user authorization and local project guidance. Preserve unrelated changes. Never invent verification or weaken a quality gate to pass.

Active profile is `core`. Read `.vinasig/standards/profiles/core.md` and the task-relevant policies. Core is valid for CLI and documentation projects and installs no browser dependencies.

Use `$vinasig-workflow` for implementation work and `$vinasig-dependencies` when adding or upgrading dependencies. Report PASS, FAIL, NOT_RUN or NOT_APPLICABLE with evidence and reasons. Commit, push and publish only within the task authorization.

For license selection, imported material or distribution changes read `policies/licensing.md` and `LICENSES.md` inside the snapshot. LIC-001 through LIC-004 require purpose-based selection, authority and dependency review, separate documentation/font/data/brand rights, consistent SPDX metadata and delivery evidence. Importing this standard does not relicense the host project.

The local manifest pins the approved snapshot. A Markdown path is a reading instruction, not an automatic import. Stop and report unresolved conflicts with mandatory policy. Record approved exceptions with owner, reason and review date.
<!-- VINASIG STANDARDS END -->