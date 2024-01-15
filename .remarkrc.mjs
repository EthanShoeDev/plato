import lintNoEmptySections from 'lint-no-empty-sections';
import presetPrettier from 'preset-prettier';
import remarkFrontmatter from 'remark-frontmatter';
import remarkLintFrontmatterSchema from 'remark-lint-frontmatter-schema';
import remarkLintNoDeadUrls from 'remark-lint-no-dead-urls';
import remarkLintNoDuplicateHeadingsInSection from 'remark-lint-no-duplicate-headings-in-section';
import remarkLintNoEmptyUrl from 'remark-lint-no-empty-url';
import remarkLintNoUrlTrailingSlash from 'remark-lint-no-url-trailing-slash';
import remarkLintWriteGood from 'remark-lint-write-good';
import remarkPresetLintConsistent from 'remark-preset-lint-consistent';
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import remarkToc from 'remark-toc';

const remarkConfig = {
  settings: {
    bullet: '*', // Use `*` for list item bullets (default)
    // See <https://github.com/remarkjs/remark/tree/main/packages/remark-stringify> for more options.
  },
  plugins: [
    remarkPresetLintConsistent, // Check that markdown is consistent.
    remarkPresetLintRecommended, // Few recommended rules.
    remarkPresetLintMarkdownStyleGuide,
    [remarkToc, { heading: 'contents' }],
    remarkFrontmatter,
    [
      remarkLintFrontmatterSchema,
      { schemas: { 'types/project.schema.yaml': ['**/*.mdx'] } },
    ],
    remarkLintNoDuplicateHeadingsInSection,
    remarkLintWriteGood,
    lintNoEmptySections,
    remarkLintNoDeadUrls,
    remarkLintNoUrlTrailingSlash,
    remarkLintNoEmptyUrl,
    presetPrettier,
  ],
};

export default remarkConfig;
