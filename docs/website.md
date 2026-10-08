# GitHub Pages publication

The owner requested GitHub Pages deployment on 8 October 2026 after the palette reconstruction, then required the palette site to participate in ecosystem preferences. The canonical site is https://brand.vinasig.io.vn/. GitHub Pages remains the host. Its original repository URL redirects to the custom domain. This publication adds a static palette interface to the existing archive. It does not modify the original artwork, fonts, palette values, evidence, existing releases or tags.

## Implementation

`scripts/build-site.ts` pre-renders Vietnamese and English palette/license pages from the validated `assets/palette.json`. It copies reviewed original exports and notices into ignored `dist/`. It publishes selected base colors and every reviewed deep tone, including Amber Olive Deep and Amber Umber Deep. The original JSON and SVG downloads remain byte-identical to the catalogued source.

Copy buttons write only their exact Hex value to the clipboard after an explicit action. Unavailable or denied clipboard access produces an inline message. The Hex text remains readable without JavaScript. There are no forms, accounts, runtime packages, remote font/script services, analytics or content collection. A meta Content Security Policy restricts script, style, image and font loading to the current origin and blocks connections. GitHub Pages manages response headers. This site does not claim arbitrary HTTP security header control.

The normal `npm run build` produces `dist/`. The preview server serves only that output at the repository base path on loopback. Original source canvases and private filesystem paths are absent from the built directory. `build-record.json` records the exact source revision, Node version and SHA-256 of every emitted file except the manifest itself. Two independent output builds at the same revision must match.

## Shared design adoption

Reviewed `VINASIG/web-design-system` revision `06528b4b5dde7848998025b065fd1490bb541e69` supplies the reviewed chrome CSS, preference CSS, shared palette tokens and preference runtime. [site/sources.json](../site/sources.json) pins their SHA-256 digests. The font URL in the emitted token stylesheet is adapted to the deployment base. The palette page adopts the approved neutral surfaces and typography and includes the same generated palette stylesheet used by the Foundations page.

Header artwork is copied from this archive's Primary Color and Reversed horizontal exports. The logo links to the VINASIG homepage. The footer follows the approved home, exact-revision source, issues and licenses order. Theme icons use the exact Lucide 1.50.0 Sun and Moon path data. Their retained upstream notice is distributed with the site.

The default route follows browser language and system appearance without writing a preference. Both locales remain separately rendered. The header uses the same EN and VI labels as Web Design System. Explicit choices use the reviewed `__Secure-vinasig-theme` and `__Secure-vinasig-language` cookies with `Domain=vinasig.io.vn`, `Path=/`, `Secure`, `SameSite=Lax` and one-year maximum age. Only finite language and theme values are shared. Theme synchronization does not navigate. A language change from another tab is deferred after interaction so it cannot discard active work. Origin-local storage remains a fallback when cookies are blocked. No clock-based theme inference, remote preference service or cross-domain workaround is used.

The standards installer updated the consumer from `core` to `web-static` using reviewed Agent Standards revision `1c0eedf84313b1a06e73e7d0be6249e3a039f7cc`. The approved bundle digest is `7927fbaa1c3b9dbd7a2ac3ee611fe8e33476d26c0c9c4f94ef61d1fcb0a2ba0b`. The dry-run and rollback record are retained locally. Managed files were not edited by hand.

## Dependency review on 8 October 2026

The official npm registry was checked before selecting these development-only packages. None ship in browser output.

| Package                   | Latest stable | Selected | Purpose                                |
| ------------------------- | ------------- | -------- | -------------------------------------- |
| @playwright/test          | 1.64.0        | 1.64.0   | Browser regression driver              |
| @axe-core/playwright      | 4.13.0        | 4.13.0   | Partial automated accessibility checks |
| html-validate             | 11.16.2       | 11.16.2  | Generated HTML validation              |
| stylelint                 | 17.16.0       | 17.16.0  | Authored CSS validation                |
| stylelint-config-standard | 40.0.0        | 40.0.0   | Compatible Stylelint preset            |

All selected versions support Node 24.21.0. Existing TypeScript, ESLint and formatting versions are retained. npm 12.2.0 and the lockfile remain pinned. npm audit reports the unpatched `braces <=3.0.3` stack-exhaustion advisory through Stylelint's globbing dependencies. The latest registry release is 3.0.3. These are build-only dependencies handling fixed repository-owned lint patterns. They are absent from the deployed site. The suggested audit downgrade to Stylelint 7.7.0 is not an appropriate remediation. No `--force`, security gate suppression or fabricated patched release is used.

## Verification contract

- Archive and palette checks retain their negative fixtures and protected original digests.
- Unit tests rebuild into two directories and compare every emitted file and the build record. They reject invalid revisions and output paths before deletion/writing.
- Strict TypeScript, checked browser JavaScript, typed lint, Stylelint and generated HTML validation run before publication.
- Playwright tests use Chromium, Firefox and WebKit with zero configured retries. Palette/license routes are checked in both locales/themes, 320/360/390/768/1024/1440 px, intermediate widths, actual 760 px breakpoint neighbors and 200 percent text. They inspect shared chrome, original artwork, visible copy, control surfaces, reflow and axe findings.
- Native locale links work without JavaScript. Unavailable-script copy buttons remain disabled and readable. Keyboard theme changes and preference reload behavior are tested. Clipboard success uses Chromium's real clipboard. Denied clipboard access is an explicit adversarial fixture in all engines.
- Reviewed shared-preference fixtures test system defaults, two distinct intercepted HTTPS origins, malformed/denied storage and protected active state. Production synchronization is separately checked between the real Brand Assets, Design System, TOTP and password websites.
- The product-owned preference fixture adapts the upstream origin-root entrypoint to the repository base path. A source comparison test retains every upstream assertion and permits only those pathname substitutions plus formatting. Managed helper bytes remain unchanged.
- Capture and open both page ends, narrow/desktop layouts, both languages/themes and enlarged text before delivery. After deployment verify exact source revision, original downloads, public metadata, sitemap, live interactions and rendered header/footer.

Enlarged narrow pages can exceed Firefox/WebKit's 32767 px full-page screenshot limit. Their reflow and full-document geometry assertions remain active. Enlarged visual evidence uses separate header, actual color card and footer captures rather than changing the layout, zoom or browser assertion to fit a screenshot API.

These are automated and SI-agent observations. Independent design review, real-phone and screen-reader participant testing are not performed. A successful build does not imply those evidence classes.

## Deployment and discovery

The workflow pins every Action by commit. Ubuntu 24.04 and Windows 2025 replace mutable `*-latest` OS labels, but their managed runner images can still change. Publication depends on both jobs and uses only the checked Ubuntu artifact. GitHub's deployment environment uses Pages permissions and OIDC, with no stored deployment credential. Pull requests do not deploy.

The Pages custom-domain setting must name `brand.vinasig.io.vn` before adding DNS. The scoped Cloudflare record is CNAME `brand` pointing to `vinasig.github.io`, DNS only, automatic TTL. Pages enforces HTTPS after its certificate is available. Localized canonicals, reciprocal hreflang, the sitemap and robots file use the custom-domain root. The sitemap is https://brand.vinasig.io.vn/sitemap.xml. The built sitemap is not proof of Google indexing. Search Console submission, Google fetch status and indexing remain separate observations.

The existing VINASIG website and organization profiles retain their accurate source-archive links and asset descriptions. The repository's About homepage points to the canonical palette website after live verification.

## License review

Archive tooling retains its existing GPL-3.0-or-later grant. The new website and build adapter use AGPL-3.0-or-later, preserving the reused design-system program's grant. The website delivers an exact-revision source link, complete standard license texts, notices, original font OFL, Lucide notice and separate brand policy. Documentation retains CC-BY-SA-4.0. Official artwork and palette data remain scoped identity assets. Publishing a website grants no new logo or trademark rights.
