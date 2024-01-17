/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['plugin:astro/recommended'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    'node_modules',
    '.cache',
    'public',
    'dist',
    '.astro',
    '_next_implementation',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // override/add rules settings here, such as:
        'astro/no-set-html-directive': 'error',
      },
    },
    {
      files: ['*.astro'],
      // ...
      processor: 'astro/client-side-ts', // <- Uses the "client-side-ts" processor.
      rules: {
        // ...
      },
    },
  ],
};
