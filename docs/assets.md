# Select and integrate VINASIG assets

Use this guide when selecting an existing asset for a VINASIG project. Read [the rights notice](../ASSET_RIGHTS.md) and the [machine-readable catalog](../asset-catalog.json) first. Do not change the underlying artwork as part of copying it into a consumer.

## Logo variants

| Variant                       | Intended context                                           | Files                                                           |
| ----------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| Primary mark                  | Standalone color symbol.                                   | [SVG and PNG exports](<../01_Logos/Primary Mark/Exports>)       |
| Contained mark                | Square avatar or tile with a white background and padding. | [SVG and PNG exports](<../01_Logos/Contained Mark/Exports>)     |
| Primary horizontal lockup     | Light surface; color symbol and Core Graphite wordmark.    | [Horizontal exports](<../01_Logos/Horizontal Lockup/Exports>)   |
| Color Black horizontal lockup | Light surface when the wordmark must be pure black.        | The Color Black SVG and PNG in the horizontal exports.          |
| Reversed horizontal lockup    | Dark surface; color symbol and white wordmark.             | The Reversed SVG and PNG in the horizontal exports.             |
| Monochrome horizontal lockup  | One-color applications.                                    | Black and white SVG and PNG versions in the horizontal exports. |
| Monochrome symbol             | One-color standalone symbol.                               | [Black and white PNG exports](../01_Logos/Monochrome/Exports)   |
| Favicon                       | Browser tab and small identity contexts.                   | [16, 32 and 48 px PNG exports](../01_Logos/Favicon/Exports)     |

Choose the existing variant that gives the intended contrast on the consumer's actual surface. Preserve aspect ratio and the mark's internal negative space. Keep the white shapes that belong to the artwork. Do not apply a gradient, redraw the geometry, reconstruct the wordmark with live text or substitute interface icons for the VINASIG mark.

Use SVG when a scalable logo is needed. The horizontal SVG viewBox is 540 by 140 units. A filename mentioning a master grid does not define the SVG's intrinsic raster dimensions. A consumer controls the display size and should preserve the viewBox ratio.

## Raster sizes and archival filename corrections

The primary PNG family contains 25, 50, 100, 200, 500 and 1000 px exports. The contained family contains 27, 54, 108, 216, 540 and 1080 px exports. These sizes come from the actual PNG headers.

Two original contained PNG names were swapped. Their paths and bytes are retained as archival evidence. New consumers can use the corrected copies:

| Correct path                                                      | Actual size   | Unchanged archival source                       |
| ----------------------------------------------------------------- | ------------- | ----------------------------------------------- |
| [assets/contained-mark-54.png](../assets/contained-mark-54.png)   | 54 by 54 px   | The original file ending in `4x - 108x108.png`. |
| [assets/contained-mark-108.png](../assets/contained-mark-108.png) | 108 by 108 px | The original file ending in `2x - 54x54.png`.   |

The gate requires each corrected copy to be byte-identical to its recorded source. These are filename corrections, not new artwork. Read catalog metadata rather than inferring dimensions from an archival basename.

Contained PNGs and the 16 px favicon have an opaque white background. The primary PNGs, horizontal PNGs, monochrome PNGs and 32/48 px favicons have an alpha channel. An alpha channel does not mean that every white or black pixel is transparent.

## Identity palette

These identity colors are recorded in the preserved [logo story](../VINASIG_Logo_Story.md).

| Name           | Color     | Identity role                           |
| -------------- | --------- | --------------------------------------- |
| Scout Blue     | `#21497B` | Observe                                 |
| Thinker Orange | `#EB7114` | Reason                                  |
| Builder Green  | `#47A036` | Act                                     |
| Auditor Red    | `#971607` | Evaluate                                |
| Core Graphite  | `#443A3B` | Primary wordmark                        |
| Black          | `#000000` | Black monochrome applications           |
| White          | `#FFFFFF` | White artwork and reversed applications |

These are identity colors, not an accessibility guarantee for text or controls. Use the [Web Design System](https://github.com/VINASIG/web-design-system) for semantic UI tokens and contrast decisions.

## Space Grotesk

The typography archive has one variable TTF with a `wght` range of 300 to 700 and five static TTFs: Light 300, Regular 400, Medium 500, SemiBold 600 and Bold 700. The variable file's default axis value is 300. Consumers should set their intended text weight explicitly.

Keep the original [OFL.txt](<../02_Typography/Space Grotesk/OFL.txt>) alongside any redistributed font software. The font notice does not license the VINASIG mark. The original TTF files remain preserved here; framework-specific loading or a reviewed web-font optimization belongs in the consuming project.

For an authorized consumer that copies the variable TTF to its own public font directory:

```css
@font-face {
  font-family: "Space Grotesk";
  src: url("/fonts/SpaceGrotesk-VariableFont_wght.ttf") format("truetype");
  font-style: normal;
  font-weight: 300 700;
  font-display: swap;
}

body {
  font-family: "Space Grotesk", sans-serif;
  font-weight: 400;
}
```

The URL in this example is a consumer path, not a new generated file in this archive. Test font loading, language coverage and fallback behavior in the actual application.

## Editable sources and studies

The `.af` and `.aseprite` files remain in their original locations. The catalog checks their bytes; it does not open or certify them in their authoring applications. Files in `Source Canvases` preserve design exploration. The canvas marked `Eliminated` records a rejected study and should not be selected as a consumer logo.

## Copying into a project

1. Select a current export using the catalog and this guide. Record the reviewed Git commit and the chosen file's digest.
2. Copy the selected asset into the consumer's established asset directory; retain the font notice if font software is copied.
3. Use the consumer's native image/font loading and base-path conventions. Keep logo aspect ratio, accessible labels and contrast appropriate to the context.
4. Verify the copied file's checksum against this archive. Test the rendered result in the consumer's browser checks.

Do not hotlink a moving `main` branch as a production asset dependency. Do not copy source studies or the entire evidence package into a website's public directory.
