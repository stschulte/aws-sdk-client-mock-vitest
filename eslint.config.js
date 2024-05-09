import eslint from "@eslint/js";
import gitignore from "eslint-config-flat-gitignore";
import perfectionistNatural from 'eslint-plugin-perfectionist/configs/recommended-natural'
import tseslint from "typescript-eslint";

export default tseslint.config(
  gitignore(),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  perfectionistNatural
);
