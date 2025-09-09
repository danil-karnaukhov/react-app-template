/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-css-modules',
    'stylelint-config-recess-order',
    'stylelint-config-prettier-scss',
  ],
  rules: {
    'color-hex-length': 'long',
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    'font-weight-notation': 'numeric',
    'selector-class-pattern': null,
    'custom-property-empty-line-before': null,
    'at-rule-empty-line-before': [
      'always',
      {
        except: 'first-nested',
        ignore: 'blockless-after-blockless',
      },
    ],
    'media-feature-range-notation': 'prefix',
    'font-family-name-quotes': 'always-unless-keyword',
    'declaration-block-single-line-max-declarations': 0,
    'selector-pseudo-class-disallowed-list': ['global'],
  },
  ignoreFiles: ['node_modules/**/*', 'build/**/*'],
}
