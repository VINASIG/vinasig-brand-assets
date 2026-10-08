import { defineConfig } from "@playwright/test";
import path from "node:path";

export default defineConfig({
  testDir: "./web",
  retries: 0,
  workers: 2,
  timeout: 180_000,
  outputDir: "../output/web/results",
  reporter: [["list"], ["json", { outputFile: "../output/web/results.json" }]],
  use: {
    baseURL: "http://127.0.0.1:4178/vinasig-brand-assets/",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    {
      name: "firefox",
      use: { browserName: "firefox" },
      testIgnore: "**/clipboard.spec.ts",
    },
    {
      name: "webkit",
      use: { browserName: "webkit" },
      testIgnore: "**/clipboard.spec.ts",
    },
  ],
  webServer: {
    command: "node scripts/serve.ts",
    cwd: path.resolve(import.meta.dirname, ".."),
    url: "http://127.0.0.1:4178/vinasig-brand-assets/",
    reuseExistingServer: !process.env["CI"],
    timeout: 30_000,
  },
});
