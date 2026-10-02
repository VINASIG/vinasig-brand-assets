# Evidence package

This folder preserves the creation record and integrity references for VINASIG Logo System 1.0. The original evidence files remain unchanged.

- [CREATION_RECORD.md](CREATION_RECORD.md) records the project, design description, master grids and original source/export paths.
- [FILE_INVENTORY.md](FILE_INVENTORY.md) records the 49 files present before this evidence folder was created, including their original sizes and modified timestamps.
- [SHA256SUMS.txt](SHA256SUMS.txt) is the original 49-entry checksum baseline. It is historical evidence and must not be regenerated in place.
- [TERMINOLOGY_UPDATE_2026-10-02.md](TERMINOLOGY_UPDATE_2026-10-02.md) records the authorized SI wording change in the logo story and its current checksum. The original story checksum remains in the initial baseline.
- [GENERATE_SHA256.ps1](GENERATE_SHA256.ps1) now runs the catalog integrity gate and writes current reports to ignored `output/checks/`. It does not scan `.git`, include tooling/dependencies, or replace this folder's original checksum file.

The [current catalog](../asset-catalog.json) covers all current asset files and pins the preserved evidence. The gate requires all 48 original asset/font/notice files to match the initial checksums and validates the story against its separately recorded revision. Two corrected filename copies are recorded separately from the original asset set.

The generator's previous broad scan could include Git internals and overwrite the original baseline after a repository was initialized. Its public preparation change is documented in [the audit](../docs/audits/publication-2026-10-03.md). The original generator remains available in Git history.

No artwork license is added by this package. Read [ASSET_RIGHTS.md](../ASSET_RIGHTS.md).
