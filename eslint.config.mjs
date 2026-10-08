import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
  files: ["scripts/**/*.ts", "tests/**/*.ts", "site/copy.js"],
  extends: [js.configs.recommended, tseslint.configs.strictTypeChecked],
  languageOptions: {
    globals: { document: "readonly", navigator: "readonly" },
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: { "@typescript-eslint/consistent-type-imports": "error" },
});
