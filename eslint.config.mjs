import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

const readonlyGlobals = (names) => Object.fromEntries(names.map((name) => [name, 'readonly']));

const nodeGlobals = readonlyGlobals(['Buffer', 'URL', 'console', 'process']);
const browserGlobals = readonlyGlobals(['URLSearchParams', 'document', 'localStorage', 'location', 'sessionStorage', 'window']);
const testGlobals = readonlyGlobals(['afterAll', 'beforeAll', 'describe', 'expect', 'it']);

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'nueprint-inventory-p1/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettier,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ['scripts/**/*.mjs', '*.config.mjs', 'src/{api,auth,db,domain,repositories,services,shared}/**/*.ts'],
    languageOptions: { globals: nodeGlobals },
  },
  {
    files: ['src/web/**/*.{ts,vue}'],
    languageOptions: { globals: browserGlobals },
  },
  {
    files: ['src/**/*.test.ts'],
    languageOptions: { globals: { ...nodeGlobals, ...testGlobals } },
  },
);
