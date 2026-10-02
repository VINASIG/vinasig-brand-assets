# VINASIG Brand Assets

The public reference archive for the VINASIG Logo System 1.0, Space Grotesk typography and the accompanying creation records. VINASIG describes its agents as SI agents, using Super Intelligence as its naming convention.

<img src="01_Logos/Contained%20Mark/Exports/VINASIG%20Contained%20Brand%20Mark%20-%2040x%20-%201080x1080.png" alt="VINASIG contained mark" width="160" height="160">

## Choose an asset

| Need                  | Asset                                                                                                                                                                                             | Selection notes                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Primary symbol        | [Primary mark SVG](<01_Logos/Primary Mark/Exports/VINASIG Primary Brand Mark - 25x25.svg>)                                                                                                        | Color symbol with a 25 by 25 master grid. The SVG has its own viewBox; the filename is not its pixel size.                   |
| Name and symbol       | [Primary horizontal lockup SVG](<01_Logos/Horizontal Lockup/Exports/VINASIG Primary Horizontal Lockup - Primary Color.svg>)                                                                       | Color symbol with a Core Graphite wordmark for light surfaces.                                                               |
| Dark surface          | [Reversed horizontal lockup SVG](<01_Logos/Horizontal Lockup/Exports/VINASIG Primary Horizontal Lockup - Reversed.svg>)                                                                           | Color symbol with a white wordmark. Check the symbol's contrast on the actual background.                                    |
| Avatar or square tile | [Contained mark PNG, 1080 px](<01_Logos/Contained Mark/Exports/VINASIG Contained Brand Mark - 40x - 1080x1080.png>)                                                                               | Square mark with an opaque white background and built-in padding.                                                            |
| Small contained PNG   | [54 px](assets/contained-mark-54.png), [108 px](assets/contained-mark-108.png)                                                                                                                    | Copies with corrected dimension names; the archival source bytes remain unchanged.                                           |
| Browser favicon       | [16 px](<01_Logos/Favicon/Exports/VINASIG Favicon - 16x16.png>), [32 px](<01_Logos/Favicon/Exports/VINASIG Favicon - 32x32.png>), [48 px](<01_Logos/Favicon/Exports/VINASIG Favicon - 48x48.png>) | Existing PNG exports. The 16 px image is opaque; 32 and 48 px include an alpha channel.                                      |
| Typography            | [Space Grotesk variable TTF](<02_Typography/Space Grotesk/fonts/variable/SpaceGrotesk-VariableFont_wght.ttf>)                                                                                     | Weight axis 300 through 700. Five static weights are also included. Retain [OFL.txt](<02_Typography/Space Grotesk/OFL.txt>). |

See [asset selection and integration](docs/assets.md) for monochrome variants, dimensions, colors and typography. [asset-catalog.json](asset-catalog.json) inventories all 50 asset files with their actual metadata and SHA-256 digests. It includes 48 original files and two corrected filename copies.

## Rights and notices

Public access does not grant a license to the VINASIG artwork. The existing [asset rights notice](ASSET_RIGHTS.md) applies to the logo exports and editable sources. Space Grotesk is accompanied by its original SIL Open Font License 1.1; that notice applies to the font software. No general license or npm publication is added by this repository's tooling.

## Repository map

| Path                                                         | Purpose                                                                                   |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| [01_Logos](01_Logos)                                         | Original exports, editable sources and historical source canvases.                        |
| [02_Typography/Space Grotesk](<02_Typography/Space Grotesk>) | Original variable and static TTF fonts with their font notice.                            |
| [assets](assets)                                             | Two contained-mark copies with corrected dimension names.                                 |
| [99_Evidence](99_Evidence)                                   | Original creation record, inventory, checksum baseline and the documented story revision. |
| [VINASIG_Logo_Story.md](VINASIG_Logo_Story.md)               | Preserved design rationale and identity palette.                                          |
| [AGENTS.md](AGENTS.md)                                       | Asset preservation rules and the pinned VINASIG SI agent standards entrypoint.            |
| [docs/standards.md](docs/standards.md)                       | Snapshot provenance and the consumer adoption contract.                                   |
| [scripts](scripts), [tests](tests)                           | Asset and standards integrity gates and their regression checks.                          |

## Verify the archive

Use Node 24.21.0 and npm 12.2.0, pinned in `.node-version` and `package.json`. Development dependencies only support repository checks; asset consumers do not need Node or npm.

```sh
npx --yes npm@12.2.0 ci --ignore-scripts
npm run check
npm test
```

After npm 12.2.0 is available, `npm ci --ignore-scripts` is the equivalent installation command. The [toolchain record](docs/toolchain.md) explains the verified versions and TypeScript compatibility constraint.

The asset gate verifies every current asset, the complete original asset set, actual PNG/SVG/font metadata, the unchanged historical evidence and both corrected copies. Reports are written to ignored `output/checks/`. The PowerShell entrypoint also runs this gate:

```powershell
./99_Evidence/GENERATE_SHA256.ps1
```

This writes `output/checks/SHA256SUMS-current.txt`; it never rewrites the historical checksum list or scans `.git`. [CI](https://github.com/VINASIG/vinasig-brand-assets/actions/workflows/check.yml) runs strict type checking, lint, formatting, integrity checks and regression tests on Linux and Windows.

## Archive history

The existing `v1.0` tag and [release](https://github.com/VINASIG/vinasig-brand-assets/releases/tag/v1.0) preserve the initial private archive. Their history remains intact. The initial checksum baseline has 49 entries: 48 asset and font files plus the original story. The story's subsequent SI terminology change is recorded in [the revision note](99_Evidence/TERMINOLOGY_UPDATE_2026-10-02.md). Current checks validate that recorded revision without replacing the initial baseline.

These records document the archive and its integrity. They do not establish an independent determination of authorship or formal registration. See [the public preparation audit](docs/audits/publication-2026-10-03.md) and [changelog](CHANGELOG.md).

## Related VINASIG repositories

- [Agent Standards](https://github.com/VINASIG/agent-standards) provides reusable SI agent policies and workflows.
- [Web Design System](https://github.com/VINASIG/web-design-system) owns web interface guidance, including Space Grotesk, Lucide interface icons and Simple Icons for third-party brand icons.
- [Favicon Forge](https://github.com/VINASIG/favicon-forge) creates favicon packages for authorized assets.

See [contributing](CONTRIBUTING.md) for archive changes and [security reporting](SECURITY.md) for sensitive findings.
