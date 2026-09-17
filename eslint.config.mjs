// eslint.config.mjs - ספי המבנה של code-structure (עיבוד מקומי של eslint.config.example.mjs).
// שינוי סף = DEC בתכנית (docs/build-plan.md), לא עריכה שקטה.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importX from "eslint-plugin-import-x";
import boundaries from "eslint-plugin-boundaries";
import checkFile from "eslint-plugin-check-file";

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "prisma/generated/**",
      "*.config.cjs",
      "*.config.mjs",
      "*.config.js",
      "*.config.ts",
      ".dependency-cruiser.cjs",
      "knip.json",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "import-x": importX,
      boundaries,
      "check-file": checkFile,
    },
    settings: {
      react: { version: "detect" },
      "boundaries/elements": [
        { type: "app", pattern: "app/**" },
        { type: "feature", pattern: "features/*", capture: ["name"], mode: "folder" },
        { type: "ui", pattern: "components/**" },
        { type: "hooks", pattern: "hooks/**" },
        { type: "lib", pattern: "lib/**" },
        { type: "tests", pattern: "tests/**" },
      ],
      "boundaries/ignore": ["**/*.test.*", "**/*.spec.*"],
    },
    rules: {
      "max-lines": ["error", { max: 300, skipBlankLines: false, skipComments: false }],
      "max-lines-per-function": ["error", { max: 50, skipBlankLines: false, skipComments: false, IIFEs: true }],
      "max-depth": ["warn", 4],
      "no-empty": ["error", { allowEmptyCatch: false }],
      "no-nested-ternary": "error",
      "prefer-const": "error",

      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports", fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      ...reactHooks.configs.recommended.rules,
      "react/no-unstable-nested-components": "error",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // מעגלי ייבוא נבדקים ע"י dependency-cruiser (npm run structure:gate) - הרזולבר של
      // import-x/no-cycle לא תואם כרגע ל-TS paths (baseUrl "@/*") בגרסה הזו.
      "import-x/no-default-export": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // רק ה-client בפועל חסום מחוץ ל-repository; ייבוא טיפוסים מ-@prisma/client מותר בכל מקום.
              group: ["@/lib/prisma"],
              message: "Prisma רק בתוך features/*/repository.ts או lib/db/. קרא ל-repository.",
            },
          ],
        },
      ],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "app", allow: ["feature", "ui", "hooks", "lib"] },
            { from: "feature", allow: ["ui", "hooks", "lib", ["feature", { name: "${from.name}" }]] },
            { from: "ui", allow: ["ui", "hooks", "lib"] },
            { from: "hooks", allow: ["hooks", "lib"] },
            { from: "lib", allow: ["lib"] },
            { from: "tests", allow: ["app", "feature", "ui", "hooks", "lib", "tests"] },
          ],
        },
      ],
      "check-file/filename-naming-convention": ["error", { "**/*.{ts,tsx}": "KEBAB_CASE" }, { ignoreMiddleExtensions: true }],
    },
  },
  {
    files: [
      "app/**/page.tsx",
      "app/**/layout.tsx",
      "app/**/route.ts",
      "app/**/error.tsx",
      "app/**/not-found.tsx",
      "app/**/loading.tsx",
      "middleware.ts",
      "*.config.*",
      "vitest.*",
      "playwright.config.ts",
    ],
    rules: { "import-x/no-default-export": "off", "check-file/filename-naming-convention": "off" },
  },
  {
    // page/layout דקים: 80 שורות.
    files: ["app/**/page.tsx", "app/**/layout.tsx"],
    rules: { "max-lines": ["error", { max: 80 }] },
  },
  {
    files: ["**/*.tsx"],
    rules: { "max-lines-per-function": ["error", { max: 150, IIFEs: true }] },
  },
  {
    files: [
      "features/**/repository.ts",
      "features/**/*.repository.ts",
      "lib/db/**",
      "lib/prisma.ts",
      "app/api/health/route.ts",
    ],
    rules: { "no-restricted-imports": "off" },
  },
  {
    files: ["tests/**", "**/*.test.*", "**/*.spec.*"],
    rules: { "max-lines": ["error", { max: 500 }], "max-lines-per-function": "off", "no-restricted-imports": "off" },
  },
  {
    files: ["prisma/seed.ts", "scripts/**/*.ts"],
    rules: {
      "no-restricted-imports": "off",
      "check-file/filename-naming-convention": "off",
      "max-lines-per-function": "off",
    },
  },
);
