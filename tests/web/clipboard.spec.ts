import { test, expect } from "@playwright/test";

test("Chromium copies exact Hex values through the real clipboard", async ({
  context,
  page,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("en/");
  await page.locator('[data-copy-hex="#21497B"]').click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "#21497B",
  );
  await expect(page.locator("[data-copy-status]")).toHaveText(
    "Copied #21497B.",
  );
  await page.locator('[data-copy-hex="#402A00"]').click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "#402A00",
  );
});
