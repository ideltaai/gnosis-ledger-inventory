import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

const browserGlobals = {
  document: 'readonly',
  localStorage: 'readonly',
  location: 'readonly',
  sessionStorage: 'readonly',
  URLSearchParams: 'readonly',
  window: 'readonly',
};

const nodeGlobals = {
  console: 'readonly',
  process: 'readonly',
};

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'nueprint-inventory-p1/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettier,
  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: browserGlobals,
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  {
    files: ['src/web/**/*.{ts,vue}'],
    languageOptions: {
      globals: browserGlobals,
    },
  },
  {
    files: ['*.config.mjs', 'scripts/**/*.mjs', 'src/api/**/*.ts', 'src/db/**/*.ts', 'src/shared/**/*.ts'],
    languageOptions: {
      globals: nodeGlobals,
    },
  },
);
