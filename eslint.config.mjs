import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const baseDirectory = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory });
const nextConfigs = compat.extends("next/core-web-vitals").map((config) => ({
  ...config,
  files: ["apps/web/**/*.{js,jsx,ts,tsx}"],
}));

const globals = {
  __dirname: "readonly",
  console: "readonly",
  module: "readonly",
  process: "readonly",
  require: "readonly",
  Response: "readonly",
};

export default [
  {
    ignores: [
      "node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/coverage/**",
      "**/convex/_generated/**",
    ],
  },
  js.configs.recommended,
  ...nextConfigs,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals,
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
];
