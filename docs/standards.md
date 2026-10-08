# VINASIG SI agent standards adoption

This archive initially adopted the `core` profile from [VINASIG Agent Standards](https://github.com/VINASIG/agent-standards), version 0.1.0 public preview. The original profile fit asset preservation, documentation and repository tooling. On 8 October 2026 the owner requested a GitHub Pages palette website. The current installation uses `web-static`, with source and digests in [.vinasig/provenance.json](../.vinasig/provenance.json). Earlier imports below remain historical records.

## Reviewed source

| Field                  | Value                                                              |
| ---------------------- | ------------------------------------------------------------------ |
| Source repository      | `VINASIG/agent-standards`                                          |
| Reviewed source commit | `00fd107bfc651d4eb9cf7f34cf5e0a9f2ee93ee9`                         |
| Profile                | `core`                                                             |
| Bundle SHA-256         | `efe05f654da53716186663ff3186623e521003fbc82eedc624a4c46d0cc8adef` |
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

Responsive, motion, SEO, browser accessibility and page-speed checks were `NOT_APPLICABLE` before the website was added. The palette website now has its own relevant web checks. [Website publication](website.md) records the adoption, delivery and evidence limits.

## Interface rules approved on 3 October 2026

The owner requested this standards update across VINASIG. LANG-004 requires natural punctuation, sentence case and custom list markers in authored interfaces. LANG-005 requires ordinary-reader language and limits parenthetical labels. Required code, URLs, times, regulatory identifiers, official names and user input retain their correct syntax.

## Header rules approved on 4 October 2026

The owner approved original transparent horizontal logos selected for the actual header surface under WEB-001. Keep the source asset bytes, proportions and internal artwork. Avoid white panels, padded or rounded cards and artwork effects. Maintain the accessible logo link and its usable target independently of image size.

This repository has no website header. Its core profile remains appropriate. The source guidance is updated for consuming websites without inventing a browser audit or changing archived asset bytes or directory data.

## Licensing adopted on 4 October 2026

The reviewed snapshot includes the licensing policy, LIC-001 through LIC-004, full GPL/CC texts, material map, brand policy, review template and license checker. It retains its own software/prose grants rather than setting this project's primary license. The owner separately selected this project's scopes in LICENSES.md. Use npm run check:licenses for source metadata/text verification. Web builds also verify published legal text and source notices. Original assets and existing gates remain required.

## Organization profile synchronization adopted on 5 October 2026

The active import uses reviewed Agent Standards source commit [2027d64b7af235b23a8b4bfa4911c924ffb47d05](https://github.com/VINASIG/agent-standards/commit/2027d64b7af235b23a8b4bfa4911c924ffb47d05), version 0.1.0, with the existing `core` profile. Earlier pins in this document describe historical imports. Current source, bundle and manifest digests are recorded in [.vinasig/provenance.json](../.vinasig/provenance.json).

CORE-009 and the [project publication checklist](../.vinasig/standards/templates/project-publication.md) require reviewing affected project README/repository details, the VINASIG website inventory and both organization profile languages when publishing a tool or changing its public facts. The public GitHub org profile uses `VINASIG/.github/profile/README.md`. Updates remain within current user authorization. Missing access or authorization is reported as pending.

The installer update preserved the consumer profile and retained a rollback backup. Snapshot structural integrity passed. A new Codex session's instruction discovery is NOT_RUN. Original artwork, application behavior and license grants are unaffected.

## Destructive action procedure adopted on 8 October 2026

The reviewed update from Agent Standards source [567d839f6fdb983582e1f0ed4c33678799cc6fe8](https://github.com/VINASIG/agent-standards/commit/567d839f6fdb983582e1f0ed4c33678799cc6fe8) extends WEB-010 with effect-based action classification, semantic red variants and `inspectDestructiveActions`. The acceptance contract is [the managed UI checklist](../.vinasig/standards/templates/web/ui-contract.md). Current bundle and manifest digests are recorded in [.vinasig/provenance.json](../.vinasig/provenance.json). The installer preserved owner instructions and retained a rollback record. Structural integrity passed; discovery by a new Codex session is NOT_RUN.
