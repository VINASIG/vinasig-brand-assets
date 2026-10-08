// SPDX-License-Identifier: AGPL-3.0-or-later
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { format } from "prettier";
import { verifyAssets } from "./check-assets.ts";
import { contrast, parsePalette, rgb, verifyPalette } from "./palette.ts";
import type { PaletteColor } from "./palette.ts";
import {
  checksum,
  digest,
  parseJson,
  record,
  repositoryRoot,
} from "./local.ts";

export const siteOrigin = "https://brand.vinasig.io.vn";
export const siteBase = "/";
const repository = "https://github.com/VINASIG/vinasig-brand-assets";
type Language = "vi" | "en";
const copy = {
  vi: {
    title: "Bảng màu VINASIG",
    description:
      "Bảng màu nhận diện VINASIG, gồm màu chính, màu bổ trợ, màu trung tính và các sắc độ đậm.",
    intro:
      "Mã màu chính xác cho nhận diện VINASIG. Chọn một ô màu để sao chép mã Hex, hoặc tải bảng màu để dùng trong dự án của bạn.",
    home: "Trang chủ VINASIG",
    skip: "Đến nội dung",
    language: "Read in English",
    dark: "Chuyển sang giao diện tối",
    nav: "Các phần của bảng màu",
    identity: "Màu nhận diện",
    support: "Màu bổ trợ",
    neutral: "Màu trung tính",
    deep: "Màu đậm",
    guide: "Cách sử dụng",
    identityDescription:
      "Năm màu gắn với biểu tượng và tên VINASIG. Các mã màu này giữ nguyên theo tài sản gốc.",
    supportDescription:
      "Các màu mở rộng để dùng khi cần thêm sắc thái bên cạnh màu nhận diện.",
    neutralDescription: "Các màu sáng và tối để phối với màu nhận diện.",
    deepDescription: "Các sắc độ đậm để lựa chọn theo ngữ cảnh sử dụng.",
    foreground: "Màu gốc",
    background: "Màu đậm",
    copy: "Sao chép mã",
    rgb: "RGB",
    downloadJson: "Tải dữ liệu JSON",
    downloadSvg: "Tải bảng màu SVG",
    reference: "Xem bảng RGB đầy đủ",
    note: "Bảng màu lấy cảm hứng từ Minecraft.",
    guideText:
      "Chọn màu chữ và màu nền theo ngữ cảnh sử dụng. Hãy kiểm tra độ tương phản của cặp màu trước khi dùng.",
    contrast: "Độ tương phản",
    contrastText:
      "Văn bản thông thường cần độ tương phản ít nhất 4.5 theo WCAG 2.2 AA. Ví dụ, chữ trắng trên Scout Blue đạt yêu cầu này. Scout Blue trên sắc độ đậm của chính nó không đạt. Hãy kiểm tra cặp màu thực tế trước khi sử dụng.",
    decisions: "Nguồn và lựa chọn",
    decisionsText:
      "Hai dự án Brand Assets và Web Design System dùng chung tên, mã Hex và token CSS. Bảng có 16 màu gốc, 30 sắc độ đậm và 45 mã Hex khác nhau.",
    research: "Đọc nguồn và tiêu chí lựa chọn",
    originals: "Tài sản gốc",
    originalsText:
      "Logo, font Space Grotesk và tài liệu nguồn có trong kho lưu trữ. Khi dùng font, hãy giữ thông báo giấy phép đi kèm. Màu và logo VINASIG tuân theo chính sách sử dụng thương hiệu.",
    assets: "Xem logo và font",
    policy: "Chính sách thương hiệu",
    source: "Mã nguồn",
    issues: "Báo lỗi",
    licenses: "Giấy phép",
    footer: "Thông tin website",
    licenseTitle: "Giấy phép và nguồn",
    licenseDescription:
      "Phạm vi giấy phép cho trang bảng màu, tài liệu, font và nhận diện VINASIG.",
    licenseSoftware:
      "Phần mềm của trang này dùng AGPL-3.0-or-later. Công cụ kiểm tra kho lưu trữ giữ giấy phép GPL-3.0-or-later. Mã nguồn đúng phiên bản triển khai có ở liên kết Mã nguồn cuối trang.",
    licenseDocs:
      "Tài liệu do VINASIG biên soạn dùng CC-BY-SA-4.0. Hãy ghi nguồn, nêu thay đổi và giữ điều kiện chia sẻ tương tự khi tái sử dụng.",
    licenseFont:
      "Space Grotesk dùng SIL Open Font License 1.1. Các icon Sun và Moon của Lucide giữ giấy phép của thư viện.",
    licenseBrand:
      "Logo và bảng màu là tài sản nhận diện riêng. Các giấy phép phần mềm và tài liệu không cấp quyền đối với thương hiệu. Hãy đọc chính sách thương hiệu trước khi sử dụng.",
    back: "Quay lại bảng màu",
    scope: "Xem phạm vi giấy phép đầy đủ",
    notice: "Thông báo nguồn và quyền sử dụng",
  },
  en: {
    title: "VINASIG color palette",
    description:
      "The VINASIG identity palette, including primary colors, supporting colors, neutrals and deep tones.",
    intro:
      "Exact colors for the VINASIG identity. Select a swatch to copy its Hex value, or download the palette for your project.",
    home: "VINASIG home",
    skip: "Skip to content",
    language: "Đọc bằng tiếng Việt",
    dark: "Switch to dark theme",
    nav: "Palette sections",
    identity: "Identity colors",
    support: "Supporting colors",
    neutral: "Neutral colors",
    deep: "Deep tones",
    guide: "Using the palette",
    identityDescription:
      "Five colors associated with the VINASIG symbol and wordmark. These values preserve the original artwork.",
    supportDescription:
      "Additional accents for contexts that need more colors alongside the identity palette.",
    neutralDescription:
      "Light and dark neutrals to pair with the identity colors.",
    deepDescription:
      "Deep reference tones for contexts that need darker colors.",
    foreground: "Base",
    background: "Deep",
    copy: "Copy",
    rgb: "RGB",
    downloadJson: "Download JSON data",
    downloadSvg: "Download SVG palette",
    reference: "View the complete RGB tables",
    note: "Palette inspired by Minecraft.",
    guideText:
      "Choose text and background colors for their actual context. Check the contrast of each pair before using it.",
    contrast: "Contrast",
    contrastText:
      "Ordinary text needs a contrast ratio of at least 4.5 under WCAG 2.2 AA. White text on Scout Blue meets that threshold. Scout Blue on its own shadow color does not. Check the actual color pair before using it.",
    decisions: "Sources and selection",
    decisionsText:
      "Brand Assets and Web Design System share names, Hex values and CSS tokens. The palette has 16 base colors, 30 deep tones and 45 distinct Hex values.",
    research: "Read the sources and selection criteria",
    originals: "Original assets",
    originalsText:
      "The archive contains logos, Space Grotesk fonts and source records. Keep the font license notice when using the font. VINASIG colors and logos follow the brand usage policy.",
    assets: "View logos and fonts",
    policy: "Brand usage policy",
    source: "Source code",
    issues: "Report an issue",
    licenses: "Licenses",
    footer: "Website information",
    licenseTitle: "Licenses and source",
    licenseDescription:
      "License scopes for the palette website, documentation, fonts and VINASIG identity.",
    licenseSoftware:
      "This website's software uses AGPL-3.0-or-later. The archive integrity tools retain GPL-3.0-or-later. The footer's Source code link provides the exact deployed revision.",
    licenseDocs:
      "VINASIG-authored documentation uses CC-BY-SA-4.0. Credit the source, identify changes and retain the applicable share-alike terms when reusing it.",
    licenseFont:
      "Space Grotesk uses SIL Open Font License 1.1. Lucide Sun and Moon icons retain their library license.",
    licenseBrand:
      "Logos and the palette are separately scoped identity assets. The software and documentation licenses do not grant trademark rights. Read the brand policy before using them.",
    back: "Back to the palette",
    scope: "Read the full license scopes",
    notice: "Source and rights notices",
  },
} as const;

function escape(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (item) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        item
      ] ?? item,
  );
}

export function route(language: Language, licenses = false): string {
  return `${siteBase}${language === "en" ? "en/" : ""}${licenses ? "licenses/" : ""}`;
}

const icons = {
  moon: '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path>',
  sun: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>',
};

function icon(name: keyof typeof icons): string {
  return `<svg class="theme-${name}" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
}

function shell(
  language: Language,
  revision: string,
  content: string,
  licenses = false,
): string {
  const c = copy[language];
  const alternate = language === "vi" ? "en" : "vi";
  const title = licenses ? c.licenseTitle : c.title;
  const description = licenses ? c.licenseDescription : c.description;
  return `<!doctype html><html lang="${language}"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title} | VINASIG</title><meta name="description" content="${description}">
    <meta name="referrer" content="no-referrer">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'; object-src 'none'">
    <meta name="build-revision" content="${revision}"><meta name="theme-color" content="#21497B">
    <link rel="canonical" href="${siteOrigin}${route(language, licenses)}">
    <link rel="alternate" hreflang="vi" href="${siteOrigin}${route("vi", licenses)}">
    <link rel="alternate" hreflang="en" href="${siteOrigin}${route("en", licenses)}">
    <link rel="alternate" hreflang="x-default" href="${siteOrigin}${route("vi", licenses)}">
    <meta property="og:type" content="website"><meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}"><meta property="og:url" content="${siteOrigin}${route(language, licenses)}">
    <meta property="og:image" content="${siteOrigin}${siteBase}assets/social.png">
    <meta name="twitter:card" content="summary"><meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${siteOrigin}${siteBase}assets/social.png">
    <link rel="icon" type="image/png" sizes="32x32" href="${siteBase}assets/favicon.png">
    <link rel="preload" href="${siteBase}assets/fonts/SpaceGrotesk-VariableFont_wght.ttf" as="font" type="font/ttf" crossorigin>
    <link rel="stylesheet" href="${siteBase}assets/tokens.css"><link rel="stylesheet" href="${siteBase}assets/preferences.css">
    <link rel="stylesheet" href="${siteBase}assets/site-chrome.css"><link rel="stylesheet" href="${siteBase}assets/control-surfaces.css"><link rel="stylesheet" href="${siteBase}assets/style.css">
    <link rel="stylesheet" href="${siteBase}assets/colors.css"><script src="${siteBase}assets/shared-preferences.js"></script>
    <script src="${siteBase}assets/copy.js" defer></script>
    </head><body><a class="skip-link" href="#content">${c.skip}</a><div data-site-shell>
    <header data-site-header><a href="https://vinasig.io.vn/" data-brand-logo aria-label="${c.home}">
    <picture><source media="(prefers-color-scheme: dark)" srcset="${siteBase}assets/reversed.svg"><img src="${siteBase}assets/primary-color.svg" width="540" height="140" alt="VINASIG"></picture></a>
    <div class="site-preferences"><button class="theme-switch" type="button" data-theme-toggle disabled aria-label="${c.dark}" aria-pressed="false">${icon("moon")}${icon("sun")}</button>
    <a class="language-switch" data-copy-notation="ISO 639-1 language code" href="${route(alternate, licenses)}" hreflang="${alternate}" lang="${alternate}" aria-label="${c.language}">${alternate === "en" ? "EN" : "VI"}</a></div></header>
    <main id="content" tabindex="-1">${content}</main>
    <footer class="site-footer" data-site-footer><a class="footer-home" href="https://vinasig.io.vn/" aria-label="${c.home}">VINASIG</a>
    <nav class="footer-links" aria-label="${c.footer}"><a href="${repository}/tree/${revision}" data-source-link>${c.source}</a><a href="${repository}/issues">${c.issues}</a><a href="${route(language, true)}">${c.licenses}</a></nav></footer>
    </div></body></html>`;
}

function swatch(hex: string, label: string, language: Language): string {
  const c = copy[language];
  return `<button type="button" class="swatch swatch-${hex.slice(1).toLowerCase()}" data-copy-hex="${hex}" disabled aria-label="${c.copy} ${hex}"><span>${label}</span><code>${hex}</code><small>${c.rgb} <code>${rgb(hex).join(" ")}</code></small></button>`;
}

function colorCard(
  color: PaletteColor,
  language: Language,
  shadowsOnly = false,
): string {
  const c = copy[language];
  const backgrounds = color.backgrounds.map((background) =>
    swatch(
      background.hex,
      color.id === "amber-deep"
        ? language === "vi"
          ? background.nameVi
          : background.name
        : c.background,
      language,
    ),
  );
  const values = shadowsOnly
    ? backgrounds
    : [swatch(color.foreground ?? "", c.foreground, language), ...backgrounds];
  return `<article class="color-card" data-palette-id="${color.id}"><h3>${escape(language === "vi" ? color.nameVi : color.name)}</h3><p class="color-source"><code>${escape(color.token ?? color.backgrounds[0]?.token ?? "")}</code></p>${values.length > 1 ? `<div class="swatch-row">${values.join("")}</div>` : values.join("")}</article>`;
}

function palettePage(
  language: Language,
  revision: string,
  colors: PaletteColor[],
): string {
  const c = copy[language];
  const groups = ["identity", "support", "neutral", "deep"] as const;
  const description = {
    identity: c.identityDescription,
    support: c.supportDescription,
    neutral: c.neutralDescription,
    deep: c.deepDescription,
  };
  const sections = groups
    .map(
      (group) =>
        `<section id="${group}" aria-labelledby="${group}-heading"><h2 id="${group}-heading">${c[group]}</h2><p class="section-description">${description[group]}</p><div class="color-grid${group === "deep" ? " deep-grid" : ""}">${colors
          .filter((color) => color.group === group)
          .map((color) => colorCard(color, language, group === "deep"))
          .join("")}</div></section>`,
    )
    .join("");
  return shell(
    language,
    revision,
    `<h1>${c.title}</h1><p class="intro">${c.intro}</p><div class="links"><a href="${siteBase}downloads/palette.json" download>${c.downloadJson}</a><a href="${siteBase}downloads/palette.svg" download>${c.downloadSvg}</a><a href="${repository}/blob/${revision}/docs/palette-reference.md">${c.reference}</a></div><nav class="section-nav" aria-label="${c.nav}">${[...groups, "guide" as const].map((group) => `<a href="#${group}">${c[group]}</a>`).join("")}</nav><p class="copy-status" role="status" data-copy-status></p><p class="palette-credit">${c.note}</p>${sections}<section class="guide" id="guide" aria-labelledby="guide-heading"><h2 id="guide-heading">${c.guide}</h2><p>${c.guideText}</p><h3>${c.contrast}</h3><p>${c.contrastText}</p><h3>${c.decisions}</h3><p>${c.decisionsText}</p><div class="links"><a href="${repository}/blob/${revision}/docs/colors.md">${c.research}</a></div><h3>${c.originals}</h3><p>${c.originalsText}</p><div class="links"><a href="${repository}/blob/${revision}/docs/assets.md">${c.assets}</a><a href="${siteBase}licenses/BRAND_POLICY.md">${c.policy}</a></div></section>`,
  );
}

function licensePage(language: Language, revision: string): string {
  const c = copy[language];
  return shell(
    language,
    revision,
    `<div class="guide"><h1>${c.licenseTitle}</h1><p class="intro">${c.licenseDescription}</p><section><h2>${c.source}</h2><p>${c.licenseSoftware}</p><div class="links"><a href="${siteBase}licenses/AGPL-3.0-or-later.txt">AGPL-3.0-or-later</a><a href="${siteBase}licenses/GPL-3.0-or-later.txt">GPL-3.0-or-later</a></div></section><section><h2>${language === "vi" ? "Tài liệu" : "Documentation"}</h2><p>${c.licenseDocs}</p><div class="links"><a href="${siteBase}licenses/CC-BY-SA-4.0.txt"><code>CC-BY-SA-4.0</code></a></div></section><section><h2>${language === "vi" ? "Font và icon" : "Fonts and icons"}</h2><p>${c.licenseFont}</p><div class="links"><a href="${siteBase}assets/fonts/OFL.txt">Space Grotesk</a><a href="${siteBase}licenses/Lucide.txt">Lucide</a></div></section><section><h2>VINASIG</h2><p>${c.licenseBrand}</p><div class="links"><a href="${siteBase}licenses/BRAND_POLICY.md">${c.policy}</a><a href="${siteBase}licenses/LICENSES.md">${c.scope}</a><a href="${siteBase}licenses/NOTICE.txt">${c.notice}</a></div></section><div class="links"><a href="${route(language)}">${c.back}</a></div></div>`,
    true,
  );
}

export async function buildSite(
  revision: string,
  target = path.join(repositoryRoot, "dist"),
): Promise<Record<string, string>> {
  assert.match(revision, /^[a-f0-9]{40}$/, "Use a complete source revision");
  await verifyAssets();
  await verifyPalette();
  const destination = path.resolve(target);
  assert(
    destination.startsWith(path.resolve(repositoryRoot) + path.sep),
    "Build output must stay in this checkout",
  );
  const parts = path.relative(repositoryRoot, destination).split(path.sep);
  assert(
    (parts.length === 1 && parts[0] === "dist") ||
      (parts.length > 1 && parts[0] === "output"),
    "Build only in dist or an ignored output subdirectory",
  );
  const sources = record(
    parseJson(await readFile(path.join(repositoryRoot, "site/sources.json"))),
  );
  assert.equal(sources["revision"], "06528b4b5dde7848998025b065fd1490bb541e69");
  for (const [file, hash] of Object.entries(record(sources["files"]))) {
    assert(/^site\/vendor\/[a-z-]+\.(css|js)$/.test(file));
    assert.equal(
      digest(await readFile(path.join(repositoryRoot, file))),
      checksum(hash),
      `Shared source drift ${file}`,
    );
  }
  await rm(destination, { recursive: true, force: true });
  const emit = async (relative: string, bytes: Uint8Array | string) => {
    const file = path.join(destination, relative);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, bytes);
  };
  const copyFile = async (source: string, relative: string) =>
    emit(relative, await readFile(path.join(repositoryRoot, source)));
  const palette = parsePalette(
    parseJson(await readFile(path.join(repositoryRoot, "assets/palette.json"))),
  );
  for (const language of ["vi", "en"] as const) {
    const prefix = language === "en" ? "en/" : "";
    await emit(
      `${prefix}index.html`,
      await format(palettePage(language, revision, palette.colors), {
        parser: "html",
      }),
    );
    await emit(
      `${prefix}licenses/index.html`,
      await format(licensePage(language, revision), { parser: "html" }),
    );
  }
  for (const file of [
    "palette.css",
    "site-chrome.css",
    "preferences.css",
    "control-surfaces.css",
    "shared-preferences.js",
  ])
    await copyFile(`site/vendor/${file}`, `assets/${file}`);
  const tokens = await readFile(
    path.join(repositoryRoot, "site/vendor/tokens.css"),
    "utf8",
  );
  assert(tokens.includes("../../public/fonts/"));
  await emit(
    "assets/tokens.css",
    tokens.replace("../../public/fonts/", "./fonts/"),
  );
  await copyFile("site/style.css", "assets/style.css");
  await copyFile("site/copy.js", "assets/copy.js");
  const values = [
    ...new Set(
      palette.colors.flatMap((color) => [
        ...(color.group === "deep" ? [] : [color.foreground ?? ""]),
        ...color.backgrounds.map((background) => background.hex),
      ]),
    ),
  ];
  const styles = values
    .map(
      (hex) =>
        `.swatch-${hex.slice(1).toLowerCase()} { background-color: ${hex}; color: ${contrast(hex, "#000000") >= contrast(hex, "#FFFFFF") ? "#000000" : "#FFFFFF"}; }`,
    )
    .join("\n");
  await emit("assets/colors.css", await format(styles, { parser: "css" }));
  for (const [source, relative] of [
    [
      "01_Logos/Horizontal Lockup/Exports/VINASIG Primary Horizontal Lockup - Primary Color.svg",
      "assets/primary-color.svg",
    ],
    [
      "01_Logos/Horizontal Lockup/Exports/VINASIG Primary Horizontal Lockup - Reversed.svg",
      "assets/reversed.svg",
    ],
    [
      "01_Logos/Favicon/Exports/VINASIG Favicon - 32x32.png",
      "assets/favicon.png",
    ],
    [
      "01_Logos/Contained Mark/Exports/VINASIG Contained Brand Mark - 40x - 1080x1080.png",
      "assets/social.png",
    ],
    [
      "02_Typography/Space Grotesk/fonts/variable/SpaceGrotesk-VariableFont_wght.ttf",
      "assets/fonts/SpaceGrotesk-VariableFont_wght.ttf",
    ],
    ["02_Typography/Space Grotesk/OFL.txt", "assets/fonts/OFL.txt"],
    ["assets/palette.json", "downloads/palette.json"],
    ["assets/palette.svg", "downloads/palette.svg"],
    ["LICENSE", "licenses/GPL-3.0-or-later.txt"],
    ["LICENSES/AGPL-3.0-or-later.txt", "licenses/AGPL-3.0-or-later.txt"],
    ["LICENSES/CC-BY-SA-4.0.txt", "licenses/CC-BY-SA-4.0.txt"],
    ["LICENSES/Lucide.txt", "licenses/Lucide.txt"],
    ["LICENSES.md", "licenses/LICENSES.md"],
    ["BRAND_POLICY.md", "licenses/BRAND_POLICY.md"],
    ["site/NOTICE.txt", "licenses/NOTICE.txt"],
  ]) {
    assert(source && relative);
    await copyFile(source, relative);
  }
  await emit(".nojekyll", "");
  await emit(
    "robots.txt",
    `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}${siteBase}sitemap.xml\n`,
  );
  const routes = (["vi", "en"] as const).flatMap((language) => [
    route(language),
    route(language, true),
  ]);
  await emit(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((url) => `<url><loc>${siteOrigin}${url}</loc></url>`).join("\n")}\n</urlset>\n`,
  );
  const files: Record<string, string> = {};
  const inventory = async (folder: string, prefix = ""): Promise<void> => {
    for (const entry of (await readdir(folder, { withFileTypes: true })).sort(
      (a, b) => a.name.localeCompare(b.name, "en"),
    )) {
      const relative = `${prefix}${entry.name}`;
      if (entry.isDirectory())
        await inventory(path.join(folder, entry.name), `${relative}/`);
      else
        files[relative] = digest(await readFile(path.join(folder, entry.name)));
    }
  };
  await inventory(destination);
  await emit(
    "build-record.json",
    `${JSON.stringify({ format: 1, revision, source: `${repository}/tree/${revision}`, site: `${siteOrigin}${siteBase}`, node: process.version, files }, null, 2)}\n`,
  );
  return files;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const revision = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  }).trim();
  const files = await buildSite(revision);
  console.log(
    `Static website built from ${revision}. ${String(Object.keys(files).length)} files plus the build record.`,
  );
}
