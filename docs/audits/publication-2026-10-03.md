# Public preparation audit

Preparation date: 3 October 2026. Scope: standardize and publish the existing `VINASIG/vinasig-brand-assets` repository under the owner's task authorization.

## Baseline and preservation

The checkout was clean on `main`, with local and remote HEAD at `8c778ef3b5dd662fcdfdcde0f80f6a6da27d4a6e`. The original archive had 58 tracked files. The existing `v1.0` tag and release describe the initial preservation commit and are retained.

The initial checksum list has 49 entries. All 48 original asset, font and notice files match that list. The story matches the separately documented SI terminology revision, with SHA-256 `e297ec5e40588b00d1b34a147f9346424a787c9fec1b5ef74698896bbd516fda`. Its older checksum remains in the initial evidence list.

The creation record, initial inventory, original checksum list, terminology update, current story, original assets, source canvases, font files and font notice are preserved. Existing asset rights remain in force. No personal legal identity or general license is added.

## Corrections and current catalog

The original contained-mark file named `2x - 54x54.png` is actually 108 by 108 px. The file named `4x - 108x108.png` is actually 54 by 54 px. Both remain untouched. Two byte-identical copies under `assets/` have correct dimension names and explicitly recorded sources.

The current catalog covers 50 files: the 48 originals and two copies. Verification reads actual PNG dimensions/alpha-channel metadata, SVG viewBoxes and TrueType family/weight/variation tables. The original PNG exports were also decoded during preparation, and representative primary, contained and horizontal exports were opened for visual inspection. Proprietary authoring sources are checked by checksum, without claiming to open or validate them in their native editors.

The old generator recursively scanned everything outside `99_Evidence` and overwrote `SHA256SUMS.txt`. After Git initialization this could include `.git`, dependency files and unrelated owner documentation. The updated PowerShell entrypoint runs the reviewed catalog gate and writes a separate 51-entry report for the 50 current assets and current story to `output/checks/SHA256SUMS-current.txt`. The original generator remains in Git history.

## Standards and tooling

The repository imports the reviewed Agent Standards 0.1.0 `core` snapshot from commit `c9d33c73a89edaf1773fa4d31f1c7258e549b7b1`. The source bundle digest, installed manifest and owner provenance are recorded in [standards adoption](../standards.md). Managed bytes and the instruction block remain owned by the installer.

The new gates use strict TypeScript and typed lint, pinned development dependencies, deliberate corruption/path/ownership fixtures, and Linux/Windows CI. Formatting excludes preserved archival files and managed snapshots. Narrow Git attributes keep new managed files reproducible while retaining the archive's original `* -text` rule.

## Verification record

Local command results are finalized before commit. Reports remain in ignored `output/checks/`; CI publishes the equivalent integrity reports as artifacts. Required exact-commit CI and anonymous access are verified after push/publication and reported with the publication handoff.

| Check                                                      | Preparation result                                        |
| ---------------------------------------------------------- | --------------------------------------------------------- |
| Original 48 asset/font/notice hashes                       | PASS                                                      |
| Historical story revision                                  | PASS                                                      |
| Original PNG decoding and representative visual inspection | PASS                                                      |
| Strict typecheck, lint, formatting and integrity gates     | PASS with Node 24.21.0 and npm 12.2.0                     |
| Negative integrity regression tests                        | PASS; 17 tests, zero failures or skips                    |
| Source standards doctor                                    | PASS for structural checks                                |
| Fresh Codex session/skill discovery                        | NOT_RUN; file verification cannot prove runtime discovery |
| Web responsive, motion, SEO and browser performance        | NOT_APPLICABLE; this repository has no web application    |
| Proprietary `.af` and `.aseprite` editor loading           | NOT_RUN; archival bytes are verified instead              |

Public visibility, repository description/topics and private vulnerability reporting are publication operations. The original tag/release, logo rights and font notice are preserved throughout preparation.

The final preservation comparison found 54 of the 58 original tracked files unchanged. Only the root README, Git attributes, evidence README and generator entrypoint were revised. A scoped scan of the original files found no matches for private-key headers, recognized token prefixes or personal Windows user paths. npm audit reported zero known dependency vulnerabilities. These checks are scoped preparation evidence, not a comprehensive secret or security certification.
