import { test, expect, type Page } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { inspectSiteChrome } from "../../.vinasig/standards/templates/web/site-chrome.mjs";
import {
  inspectHeaderBrand,
  inspectInterface,
  inspectControlSurfaces,
  inspectControlIndicators,
} from "../../.vinasig/standards/templates/web/interface.mjs";
import { checkSharedPreferences } from "../helpers/preferences.mjs";

const widths = [320, 360, 390, 600, 759, 760, 761, 768, 900, 1024, 1440];

async function expectFilledSwatches(page: Page): Promise<void> {
  const measured = await page.locator(".color-card").evaluateAll((cards) =>
    cards.map((card) => {
      const row = card.querySelector(".swatch-row");
      const container = row ?? card;
      const style = getComputedStyle(container);
      const bounds = container.getBoundingClientRect();
      const left =
        bounds.left +
        parseFloat(style.borderLeftWidth) +
        parseFloat(style.paddingLeft);
      const right =
        bounds.right -
        parseFloat(style.borderRightWidth) -
        parseFloat(style.paddingRight);
      const boxes = [...container.querySelectorAll(".swatch")].map((swatch) =>
        swatch.getBoundingClientRect(),
      );
      const first = boxes[0];
      const last = boxes.at(-1);
      return {
        id: card.getAttribute("data-palette-id"),
        count: boxes.length,
        leftGap: first ? first.left - left : Infinity,
        rightGap: last ? right - last.right : Infinity,
        widthDifference:
          first && last ? Math.abs(first.width - last.width) : Infinity,
      };
    }),
  );
  expect(measured.filter((card) => card.count === 1)).toHaveLength(12);
  expect(measured.filter((card) => card.count === 2)).toHaveLength(17);
  expect(
    measured.filter(
      (card) =>
        Math.abs(card.leftGap) > 1 ||
        Math.abs(card.rightGap) > 1 ||
        card.widthDifference > 1,
    ),
  ).toEqual([]);
}

for (const language of ["vi", "en"] as const) {
  for (const theme of ["light", "dark"] as const) {
    for (const licenses of [false, true]) {
      test(`${language} ${theme} ${licenses ? "licenses" : "palette"} fits responsive layouts and shared chrome`, async ({
        page,
      }, info) => {
        await page.context().addInitScript(
          ({ language, theme }) => {
            localStorage.setItem("vinasig-language", language);
            localStorage.setItem("vinasig-theme", theme);
          },
          { language, theme },
        );
        const errors: string[] = [];
        page.on("pageerror", (error) => {
          errors.push(error.message);
        });
        const route = `${language === "en" ? "en/" : ""}${licenses ? "licenses/" : ""}`;
        await page.goto(route || "./");
        await page.evaluate(async () => {
          await document.fonts.ready;
        });
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await expect(page.locator("[data-theme-toggle]")).toBeEnabled();
        for (const width of widths) {
          await page.setViewportSize({
            width,
            height:
              width === 360
                ? 800
                : width === 768
                  ? 1024
                  : width === 1024
                    ? 768
                    : width < 600
                      ? 844
                      : 900,
          });
          const measured = await page.evaluate(() => ({
            width: document.documentElement.scrollWidth,
            client: document.documentElement.clientWidth,
          }));
          expect(measured.width).toBeLessThanOrEqual(measured.client + 1);
          expect(await page.evaluate(inspectSiteChrome)).toEqual([]);
          expect(await page.evaluate(inspectHeaderBrand)).toEqual([]);
          expect(await page.evaluate(inspectInterface)).toEqual([]);
          expect(await page.evaluate(inspectControlIndicators)).toEqual([]);
          expect(await page.evaluate(inspectControlSurfaces)).toEqual([]);
          if (!licenses) {
            await expect(page.locator("[data-copy-hex]")).toHaveCount(46);
            await expect(page.locator(".color-card")).toHaveCount(29);
            await expectFilledSwatches(page);
          }
          await page.evaluate(() => {
            window.scrollTo(0, document.documentElement.scrollHeight);
          });
          if (width === 320 || width === 1440) {
            await page.screenshot({
              path: info.outputPath(`footer-${String(width)}.png`),
            });
            await page.evaluate(() => {
              window.scrollTo(0, 0);
            });
            await page.screenshot({
              path: info.outputPath(`header-${String(width)}.png`),
            });
            await page.screenshot({
              path: info.outputPath(`full-${String(width)}.png`),
              fullPage: true,
            });
          }
        }
        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(axe.violations).toEqual([]);
        await page.setViewportSize({ width: 320, height: 800 });
        await page.evaluate(() => {
          document.documentElement.style.fontSize = "200%";
        });
        expect(await page.evaluate(inspectSiteChrome)).toEqual([]);
        expect(
          await page.evaluate(
            () =>
              document.documentElement.scrollWidth <=
              document.documentElement.clientWidth + 1,
          ),
        ).toBe(true);
        if (!licenses) {
          const wrapping = await page
            .locator(".swatch code")
            .evaluateAll((codes) =>
              codes.some((code) => {
                const selection = document.createRange();
                selection.selectNodeContents(code);
                return selection.getClientRects().length !== 1;
              }),
            );
          expect(wrapping).toBe(false);
          await expectFilledSwatches(page);
        }
        await page.evaluate(() => {
          window.scrollTo(0, 0);
        });
        await page.screenshot({ path: info.outputPath("enlarged-header.png") });
        if (!licenses) {
          await page
            .locator("#identity .color-card")
            .last()
            .scrollIntoViewIfNeeded();
          await page.screenshot({ path: info.outputPath("enlarged-card.png") });
        }
        await page.evaluate(() => {
          window.scrollTo(0, document.documentElement.scrollHeight);
        });
        await page.screenshot({ path: info.outputPath("enlarged-footer.png") });
        expect(errors).toEqual([]);
      });
    }
  }
}

test("system defaults, blocked scripts, native navigation and keyboard actions work", async ({
  browser,
}) => {
  for (const theme of ["light", "dark"] as const) {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      colorScheme: theme,
      viewport: { width: 320, height: 800 },
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4178/vinasig-brand-assets/");
    await expect(page.locator("[data-theme-toggle]")).toBeDisabled();
    await expect(page.locator("[data-copy-hex]").first()).toBeDisabled();
    expect(await page.evaluate(inspectSiteChrome)).toEqual([]);
    expect(await page.evaluate(inspectHeaderBrand)).toEqual([]);
    await page.locator(".language-switch").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await context.close();
  }
  const context = await browser.newContext({
    locale: "en-US",
    colorScheme: "dark",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4178/vinasig-brand-assets/");
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  await page.locator("[data-theme-toggle]").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await context.close();
});

test("copy failures are visible and do not change the selected color", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: () => Promise.reject(new Error("Permission denied")),
      },
    });
  });
  await page.goto("en/");
  const swatch = page.locator('[data-copy-hex="#21497B"]');
  await swatch.click();
  await expect(page.locator("[data-copy-status]")).toContainText(
    "Copy is unavailable",
  );
  await expect(swatch.locator("code").first()).toHaveText("#21497B");
});

test("reviewed preference runtime passes two-origin adversarial fixtures", async ({
  browser,
  baseURL,
}) => {
  expect(baseURL).toBeTruthy();
  await checkSharedPreferences(browser, baseURL ?? "");
});
