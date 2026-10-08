# Changelog

## Palette reconstruction - 2026-10-08

- Keep all five identity Hex values and original artwork unchanged. Add a source JSON, visual SVG and RGB/Hex reference with selected Foreground and all Background shadow values from the owner-supplied Minecraft table.
- Select 16 Foreground values and retain 30 Background values, including both Gold edition variants. Exclude classic chromatic foregrounds and Minecoin Gold from the selected palette while retaining their provenance.
- Record the Emerald and Resin source RGB/Hex conflicts and derive exported RGB from the preserved Hex values.
- Report contrast failures for matched source pairs rather than implying that a source pair is an approved text/background combination.
- Append two reviewed palette assets to the catalog. Retain the original 48-file preservation check, five protected records and two byte-identical filename corrections.
- Add deterministic SVG/Markdown rebuild checks and focused negative fixtures without adding dependencies, changing legal grants or updating the historical checksum baseline.

## Licensing - 2026-10-04

- License offline integrity tools under GPL-3.0-or-later and authored documentation under CC-BY-SA-4.0.
- Add the separate VINASIG Brand Usage Policy. Keep original artwork, font notices and historical evidence unchanged.
- Import the reviewed licensing procedure and nine additional required files. The exact core payload expectation increases from 18 to 27 and asserts each added file. Existing tamper/failure assertions remain required.
- Check license metadata and publisher text digests without normalizing literal legal text.

## 2026-10-03

- Prepare `VINASIG/vinasig-brand-assets` for public access with asset selection, typography, rights, contribution and security guidance.
- Adopt the reviewed VINASIG SI agent standards 0.1.0 snapshot with the `core` profile and owner preservation rules.
- Add a 50-file catalog with actual PNG/SVG/font metadata and SHA-256 digests. Preserve all 48 original asset and font files.
- Add byte-identical contained-mark copies named for their actual 54 and 108 px dimensions while retaining the original swapped filenames.
- Replace the checksum generator's broad scan and historical overwrite with verified current reports in `output/checks/`.
- Add pinned strict TypeScript, typed lint, formatting, asset and standards checks, regression tests, and Linux/Windows CI.
- Preserve the creation record, original inventory, initial checksum list, documented SI story revision and existing `v1.0` history.

## 2026-10-02

- Adopt SI terminology in the logo story and record its new checksum without replacing the initial archive evidence.

## 2026-09-26

- Preserve VINASIG Logo System 1.0, source canvases, exports and the Space Grotesk font files with their original notice.
