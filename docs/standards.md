# VINASIG SI agent standards adoption

This archive adopts the `core` profile from [VINASIG Agent Standards](https://github.com/VINASIG/agent-standards), version 0.1.0 public preview. The profile fits asset preservation, documentation and repository tooling. There is no web application in this repository.

## Reviewed source

| Field                  | Value                                                              |
| ---------------------- | ------------------------------------------------------------------ |
| Source repository      | `VINASIG/agent-standards`                                          |
| Reviewed source commit | `76901601b193c963b849b253d11f51363b447ffe`                         |
| Profile                | `core`                                                             |
| Bundle SHA-256         | `bb555aad2e5c66da8ba2cdd5530446ca95c1235bb28706cb82066222adcb61f1` |
| Local provenance       | [.vinasig/provenance.json](../.vinasig/provenance.json)            |
| Installed file map     | [.vinasig/manifest.json](../.vinasig/manifest.json)                |

The source commit was checked against the public remote. A local bundle was inspected and its installation preview reviewed before importing it. `source.ref` in the managed manifest is a content digest, not a Git commit; the owner provenance file records the separately verified Git commit.

The copied source registry describes access conditions at its original research date. Its references to private VINASIG archives are historical context. Publication of this repository does not require editing those digest-pinned source records.

## Managed content

The installer owns the marked block in [AGENTS.md](../AGENTS.md), `.vinasig/manifest.json`, `.vinasig/standards/` and the two imported workflow/dependency skills in `.agents/skills/`. Local asset rules outside the block specialize preservation, rights, checksum reporting and publication. The owner provenance file and validation scripts are maintained by this repository.

Do not manually edit or reformat managed files. A standards update requires a separately reviewed bundle, explicit target, approved digest, dry-run review and the source installer's update command. Never fetch a moving branch during an agent session or alter global Codex/MCP settings to adopt this archive.

## Verification boundary

`npm run check:standards` verifies the approved manifest digest, every managed file, the instruction block, the root instruction budget and the absence of a shadowing `AGENTS.override.md`. Regression tests exercise tampering and ownership boundaries.

The source installer's `doctor` verifies structural integrity. Actual skill discovery by a new Codex session is `NOT_RUN` in this publication audit. Start a fresh session for runtime discovery; file integrity alone cannot prove what a session loaded.

Responsive, motion, SEO, browser accessibility and page-speed checks are `NOT_APPLICABLE` to this repository's current archive surface. The consuming web project must run its own relevant checks after integrating an asset.

## Interface rules approved on 3 October 2026

The owner requested this standards update across VINASIG. LANG-004 requires natural punctuation, sentence case and custom list markers in authored interfaces. LANG-005 requires ordinary-reader language and limits parenthetical labels. Required code, URLs, times, regulatory identifiers, official names and user input retain their correct syntax.
