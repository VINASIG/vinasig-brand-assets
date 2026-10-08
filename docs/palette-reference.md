# VINASIG palette reference

Generated from [palette.json](../assets/palette.json) by [the palette renderer](../scripts/palette.ts). Read [selection and use](colors.md) before choosing colors. RGB values are derived from Hex. Background means the source text-shadow color.

## Selected Foreground values and corresponding Background values

| Name           | Group    | Source code | Foreground | Foreground RGB | Background | Background RGB |
| -------------- | -------- | ----------- | ---------- | -------------- | ---------- | -------------- |
| Scout Blue     | identity | `§t`        | `#21497B`  | 33, 73, 123    | `#08121E`  | 8, 18, 30      |
| Thinker Orange | identity | `§v`        | `#EB7114`  | 235, 113, 20   | `#3B1D05`  | 59, 29, 5      |
| Builder Green  | identity | `§q`        | `#47A036`  | 71, 160, 54    | `#04280D`  | 4, 40, 13      |
| Auditor Red    | identity | `§m`        | `#971607`  | 151, 22, 7     | `#250501`  | 37, 5, 1       |
| Core Graphite  | identity | `§j`        | `#443A3B`  | 68, 58, 59     | `#110E0E`  | 17, 14, 14     |
| Support Copper | support  | `§n`        | `#B4684D`  | 180, 104, 77   | `#2D1A13`  | 45, 26, 19     |
| Support Amber  | support  | `§p`        | `#DEB12D`  | 222, 177, 45   | `#372C0B`  | 55, 44, 11     |
| Support Teal   | support  | `§s`        | `#2CBAA8`  | 44, 186, 168   | `#0B2E2A`  | 11, 46, 42     |
| Support Violet | support  | `§u`        | `#9A5CC6`  | 154, 92, 198   | `#261731`  | 38, 23, 49     |
| Soft Blue      | support  | `§w`        | `#8BB3FF`  | 139, 179, 255  | `#232D40`  | 35, 45, 64     |
| Quartz Surface | neutral  | `§h`        | `#E3D4D1`  | 227, 212, 209  | `#383534`  | 56, 53, 52     |
| Iron Surface   | neutral  | `§i`        | `#CECACA`  | 206, 202, 202  | `#333232`  | 51, 50, 50     |
| Gray           | neutral  | `§7`        | `#AAAAAA`  | 170, 170, 170  | `#2A2A2A`  | 42, 42, 42     |
| Dark Gray      | neutral  | `§8`        | `#555555`  | 85, 85, 85     | `#151515`  | 21, 21, 21     |
| Black          | neutral  | `§0`        | `#000000`  | 0, 0, 0        | `#000000`  | 0, 0, 0        |
| White          | neutral  | `§f`        | `#FFFFFF`  | 255, 255, 255  | `#3F3F3F`  | 63, 63, 63     |

## Additional Background values

Excluded Foreground values remain in the source JSON for traceability. They are not selected palette colors. Edition labels distinguish the two Gold shadow values. Source row means no edition split is needed for that value, not that its code is supported by every Minecraft edition.

| Name                 | Source code | Source name     | Background | Background RGB | Edition    |
| -------------------- | ----------- | --------------- | ---------- | -------------- | ---------- |
| Dark Blue Shadow     | `§1`        | `dark_blue`     | `#00002A`  | 0, 0, 42       | Source row |
| Dark Green Shadow    | `§2`        | `dark_green`    | `#002A00`  | 0, 42, 0       | Source row |
| Dark Aqua Shadow     | `§3`        | `dark_aqua`     | `#002A2A`  | 0, 42, 42      | Source row |
| Dark Red Shadow      | `§4`        | `dark_red`      | `#2A0000`  | 42, 0, 0       | Source row |
| Dark Purple Shadow   | `§5`        | `dark_purple`   | `#2A002A`  | 42, 0, 42      | Source row |
| Gold Shadow          | `§6`        | `gold`          | `#2A2A00`  | 42, 42, 0      | Java       |
| Gold Shadow          | `§6`        | `gold`          | `#402A00`  | 64, 42, 0      | Bedrock    |
| Blue Shadow          | `§9`        | `blue`          | `#15153F`  | 21, 21, 63     | Source row |
| Green Shadow         | `§a`        | `green`         | `#153F15`  | 21, 63, 21     | Source row |
| Aqua Shadow          | `§b`        | `aqua`          | `#153F3F`  | 21, 63, 63     | Source row |
| Red Shadow           | `§c`        | `red`           | `#3F1515`  | 63, 21, 21     | Source row |
| Light Purple Shadow  | `§d`        | `light_purple`  | `#3F153F`  | 63, 21, 63     | Source row |
| Yellow Shadow        | `§e`        | `yellow`        | `#3F3F15`  | 63, 63, 21     | Source row |
| Minecoin Gold Shadow | `§g`        | `minecoin_gold` | `#373501`  | 55, 53, 1      | Source row |

## Matched source-pair contrast

These measurements compare selected source Foreground values with their corresponding Background values. They do not recommend using every pair. Threshold decisions use the unrounded ratio. Displayed ratios are truncated to two decimals. AA normal text requires at least 4.5 to 1. Large text and required non-text boundaries need separate context checks.

| Name           | Foreground | Background | Contrast | AA normal text |
| -------------- | ---------- | ---------- | -------- | -------------- |
| Scout Blue     | `#21497B`  | `#08121E`  | 2.06     | FAIL           |
| Thinker Orange | `#EB7114`  | `#3B1D05`  | 5.06     | PASS           |
| Builder Green  | `#47A036`  | `#04280D`  | 4.83     | PASS           |
| Auditor Red    | `#971607`  | `#250501`  | 2.21     | FAIL           |
| Core Graphite  | `#443A3B`  | `#110E0E`  | 1.75     | FAIL           |
| Support Copper | `#B4684D`  | `#2D1A13`  | 3.96     | FAIL           |
| Support Amber  | `#DEB12D`  | `#372C0B`  | 6.82     | PASS           |
| Support Teal   | `#2CBAA8`  | `#0B2E2A`  | 6.04     | PASS           |
| Support Violet | `#9A5CC6`  | `#261731`  | 3.77     | FAIL           |
| Soft Blue      | `#8BB3FF`  | `#232D40`  | 6.56     | PASS           |
| Quartz Surface | `#E3D4D1`  | `#383534`  | 8.45     | PASS           |
| Iron Surface   | `#CECACA`  | `#333232`  | 7.86     | PASS           |
| Gray           | `#AAAAAA`  | `#2A2A2A`  | 6.17     | PASS           |
| Dark Gray      | `#555555`  | `#151515`  | 2.44     | FAIL           |
| Black          | `#000000`  | `#000000`  | 1.00     | FAIL           |
| White          | `#FFFFFF`  | `#3F3F3F`  | 10.53    | PASS           |

Source values are from the [owner-supplied Minecraft color table](https://minecraft.fandom.com/wiki/Formatting_codes#Color_codes). Selection, names and formatting are adapted for VINASIG. The two source RGB conflicts are retained in palette.json. This reference does not certify current game implementation values or Mojang endorsement.
