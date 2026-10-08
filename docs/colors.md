# VINASIG color palette

![VINASIG palette with Foreground and Background swatches](../assets/palette.svg)

The palette was reconstructed on 8 October 2026 from the Minecraft color table supplied by the owner. The five identity colors and every original logo remain unchanged. The previous identity table contained five material-derived colors, black and white. It did not include the source Background values.

Read the [complete Hex and RGB reference](palette-reference.md), use the [source JSON](../assets/palette.json), or view the [SVG sheet](../assets/palette.svg). Selection is a design decision, not evidence that these colors are best for every user or application.

## Foreground and Background

In the source table, Foreground is the text color and Background is the text-shadow color. Background does not describe a Minecraft page or block fill. This palette makes those exact shadow values available as dark color primitives.

Source column names describe provenance. A selected Foreground color can be used as a surface, and a Background value can be used as an accent. Choose the actual text and surface together. Matching source columns do not imply an accessible combination or a light/dark theme. Quartz Surface and Iron Surface come from the source Foreground column and provide lighter neutral surfaces.

## Selection

- Identity keeps Scout Blue, Thinker Orange, Builder Green, Auditor Red and Core Graphite. Their Hex values are already present in the preserved artwork and [logo story](../VINASIG_Logo_Story.md).
- Support adds Copper, Amber, Teal, Violet and Soft Blue for illustrations, category accents and occasional highlights. They do not replace the four agent roles.
- Neutral adds Quartz Surface, Iron Surface, Gray, Dark Gray, Black and White. Core Graphite remains the primary wordmark color.
- Shadow includes every source Background value. This keeps material shadows and the classic chromatic shadows even when their Foreground values are not selected.

The selection has 16 Foreground values and 30 Background values. Black occurs in both columns, so there are 45 distinct selected colors. Thirteen source Foreground values are excluded from the selected palette and retained only in JSON for traceability. These are the classic chromatic foregrounds and Minecoin Gold. The choice favors the established identity over highly saturated classic accents. There is no numeric cutoff that proves perceived glare, comfort or preference.

Gold has two source shadows. Java uses `#2A2A00` and Bedrock uses `#402A00`. Both are available, with an explicit edition suffix. A JSON Background edition of `unsplit` means the supplied row has one shadow value. It does not mean that every Minecraft edition supports the associated code.

## Source RGB conflicts

The owner-supplied table has two inconsistent Foreground RGB/Hex pairs. Hex is authoritative for this reconstruction because it matches the current artwork.

| Source        | Submitted RGB | Retained Hex | RGB derived from Hex |
| ------------- | ------------- | ------------ | -------------------- |
| Emerald, `§q` | 17, 160, 54   | `#47A036`    | 71, 160, 54          |
| Resin, `§v`   | 235, 114, 20  | `#EB7114`    | 235, 113, 20         |

These differences are preserved in `sourceConflicts` rather than silently copied into exports. We have not inspected game binaries or certified which RGB tuple a current game version implements. The [source table](https://minecraft.fandom.com/wiki/Formatting_codes#Color_codes) is cited for color values and names, not for VINASIG endorsement or identity rights.

## Text and surface choices

The [reference](palette-reference.md#matched-source-pair-contrast) reports contrast for every selected Foreground with its source Background. Several fail normal-text contrast, including the dark identity colors. Those values remain useful as color primitives. A FAIL is a restriction on that text pair, not a broken color.

Use Core Graphite on White or Quartz Surface for general text. Use Scout Blue on White or Quartz Surface for a link or primary action. On the Core Graphite shadow `#110E0E`, White or Quartz Surface can supply general text. The brighter identity accents can be suitable on that dark surface, but Auditor Red needs a different text treatment. Orange or Green text on White does not meet normal-text AA. White text on Orange or Green fails the same threshold. Black is a passing text choice on those solid color fills.

The implementation follows the W3C sRGB luminance and contrast formula. Normal text requires at least 4.5 to 1, while large text has a 3 to 1 minimum. Required non-text visual boundaries have a separate 3 to 1 requirement. Decisions use unrounded results, not the truncated displayed ratio. See [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

These measurements evaluate solid sRGB color pairs. They do not certify a whole interface, a logo, print output, gradients, transparency, antialiasing, color-vision usability or perceived glare. Pair colors with text or shapes when they convey meaning. Semantic interface tokens and actual theme integrations belong in the [Web Design System](https://github.com/VINASIG/web-design-system).

## Rebuild and verify

Use the pinned toolchain and run `npm run build:palette` to regenerate the SVG and Markdown reference. It never updates catalog digests. Review the new output and explicitly record only authorized new export digests. `npm run check:palette` rejects an export that differs from its JSON source. `npm run check` also checks the catalog, all unchanged originals and the preserved evidence.

The SVG contains literal colors and no scripts, external resources or embedded font software. Text requests Space Grotesk with an Arial fallback. Available fonts can affect text rendering, but not the color values or deterministic SVG bytes. The generated Markdown uses the already pinned Prettier version. The [audit record](audits/palette-2026-10-08.md) describes scope, evidence and rights.
