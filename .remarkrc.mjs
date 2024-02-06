import dictionary from 'dictionary-en';
import remarkLintFileExtension from 'remark-lint-file-extension';
// @ts-expect-error no types given
import remarkLintNoDeadUrls from 'remark-lint-no-dead-urls';
import remarkLintNoDuplicateHeadingsInSection from 'remark-lint-no-duplicate-headings-in-section';
// @ts-expect-error no types given
import remarkLintNoEmptySections from 'remark-lint-no-empty-sections';
import remarkLintNoEmptyUrl from 'remark-lint-no-empty-url';
// @ts-expect-error no types given
import remarkLintNoUrlTrailingSlash from 'remark-lint-no-url-trailing-slash';
// import remarkLintWriteGood from 'remark-lint-write-good';
import remarkMdx from 'remark-mdx';
import remarkPresetLintConsistent from 'remark-preset-lint-consistent';
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import presetPrettier from 'remark-preset-prettier';
import remarkRetext from 'remark-retext';
import retextEnglish from 'retext-english';
import retextIndefiniteArticle from 'retext-indefinite-article';
import retextPassive from 'retext-passive';
// import retextReadability from 'retext-readability';
import retextRepeatedWords from 'retext-repeated-words';
// import retextSimplify from 'retext-simplify';
import retextSpell from 'retext-spell';
import { unified } from 'unified';

const remarkConfig = {
  settings: {
    bullet: '*', // Use `*` for list item bullets (default)
    // See <https://github.com/remarkjs/remark/tree/main/packages/remark-stringify> for more options.
  },
  plugins: [
    remarkPresetLintConsistent, // Check that markdown is consistent.
    remarkPresetLintRecommended, // Few recommended rules.
    remarkPresetLintMarkdownStyleGuide,
    remarkLintNoDuplicateHeadingsInSection,
    // remarkLintWriteGood,
    remarkLintNoDeadUrls,
    remarkLintNoUrlTrailingSlash,
    remarkLintNoEmptyUrl,
    [
      remarkRetext,
      unified()
        .use(retextEnglish)
        .use(retextSpell, {
          dictionary: (onload) => onload(undefined, dictionary),
        })
        // .use(retextReadability)
        .use(retextIndefiniteArticle)
        .use(retextPassive)
        .use(retextRepeatedWords),
      // .use(retextSimplify),
    ],
    remarkMdx,
    [remarkLintFileExtension, 'mdx'],
    presetPrettier,
    [remarkLintNoEmptySections, 'off'],
  ],
};

export default remarkConfig;
