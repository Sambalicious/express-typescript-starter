import { default as eslint, default as js } from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended", "prettier"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  {
    files: ["**/*.{js,ts}"],
    ignores: ["**/*.js", "dist/**/*", "node_modules/**/*"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "unicorn/better-regex": "warn",
      "unicorn/no-process-exit": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/prevent-abbreviations": [
        "error",
        { replacements: { params: false } },
      ],
    },
  },
  {
    files: ["src/**/*.test.{js,ts}"],
    ...vitest.configs.recommended,
  },
  eslintPluginPrettierRecommended,
]);
