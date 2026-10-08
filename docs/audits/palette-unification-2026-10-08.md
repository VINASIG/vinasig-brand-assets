# Shared palette review on 8 October 2026

The owner requested identical palettes in Brand Assets and Web Design System, VINASIG names without formatting identifiers, and one short inspiration credit on the public page.

Brand Assets owns the canonical format-2 JSON. It has 16 base colors, 30 deep tones and 45 distinct Hex values. A direct comparison against revision 5fc143f20ac758a2584fa9d59482526456c78efb proved that the selected Hex set is unchanged. Only the two authorized current palette files receive reviewed catalog updates. All 48 original artwork/font files and protected historical evidence retain their prior bytes.

Supporting and neutral names follow the Design System's existing vocabulary where appropriate. The five identity anchors retain their original names and values. Deep tones receive their own names rather than game color names or edition labels. Excluded bright base values are absent from the consumer JSON. Both languages and every CSS token are part of the shared record.

The palette parser now requires format 2, the complete reviewed ID inventory, both Amber deep tones, preserved anchors, valid names/tokens, exact sRGB notation and the two RGB correction records. Negative integrity cases remain active. Tests explicitly reject formatting identifiers in product exports and require one inspiration line in each localized palette page.

Web Design System vendors the exact JSON with a repository, commit and SHA-256 record. Its palette stylesheet is generated from that JSON. Its Foundations page reads the same data. A check compares the source hash, generated CSS and translated names. Normal builds require no network fetch and cannot silently adopt a newer upstream palette.

Earlier palette audits document historical names and source research. They do not define current consumer naming. Current palette, generated SVG, reference, token names and published pages use the shared vocabulary. Existing tags, releases, original story and archival evidence are preserved.

The palette viewer adopts Web Design System revision 37ed632e52d4b20fdd6c3a1e9bd2363a75ba4d58. All six copied source files were compared byte for byte with that public revision. The Design System's adopted JSON matches this repository's canonical data exactly. The emitted palette stylesheet retains the same 46 tokens and selected 45 Hex values. The build regression checks every declaration and its real stylesheet import.

After this adoption, local source, asset, build and HTML checks passed, all 30 Node regression cases passed, and all 34 configured browser cases passed with zero retries. Public artifact hashes and exact deployment revisions remain a separate verification step.
