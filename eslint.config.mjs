import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import jest from 'eslint-plugin-jest';
import jsdoc from 'eslint-plugin-jsdoc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: [
      'dist', 'coverage', 'jobs', 'node_modules',
      'eslint.config.mjs', 'jest.config.ts', 'tsconfig.json',
    ],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ),
  {
    plugins: { jest, jsdoc },

    languageOptions: {
      globals: {},
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { project: ['./tsconfig.json'], tsconfigRootDir: import.meta.dirname },
    },

    rules: {
      camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],
      'comma-dangle': ['warn', 'always-multiline'],
      'import/prefer-default-export': 'off',
      'implicit-arrow-linebreak': 'off',
      'operator-linebreak': ['warn', 'after'],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'jest/valid-expect': ['error', { maxArgs: 2 }],
    },
  },
];
