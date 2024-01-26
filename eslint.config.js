import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import astroParser from 'astro-eslint-parser';
import astro from 'eslint-plugin-astro';
import * as mdx from 'eslint-plugin-mdx';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ resolvePluginsRelativeTo: __dirname });

export default [
  // --------- Typescript React Config ---------
  // https://github.com/typescript-eslint/typescript-eslint/pull/7935 TODO
  ...compat.plugins('@typescript-eslint'),
  ...compat.extends('plugin:@typescript-eslint/recommended'), // ts, tsx, mts, cts
  // --------- MDX Config ---------
  {
    ...mdx.flat,
    // optional, if you want to lint code blocks at the same
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true,
      // optional, if you want to disable language mapper, set it to `false`
      // if you want to override the default language mapper inside, you can provide your own
      languageMapper: {},
    }),
  },
  {
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  // --------- Astro Config ---------
  {
    files: ['**/*.astro'],
    plugins: {
      astro,
    },
    processor: 'astro/client-side-ts', // <- Uses the "client-side-ts" processor.
    languageOptions: {
      globals: {
        node: true,
        'astro/astro': true,
        es2020: true,
      },
      parser: astroParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
        sourceType: 'module',
      },
    },
    rules: {
      ...astro.configs.all.rules,
      ...compat
        .extends('plugin:@typescript-eslint/recommended')
        .map((c) => c.rules)
        .reduce((a, b) => ({ ...a, ...b }), {}),
    },
  },
  // --------- Custom Config ---------
  {
    files: ['src/env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
];
