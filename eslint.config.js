import jsPlugin from '@eslint/js'
import cssModulesPlugin from 'eslint-plugin-css-modules'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['build/**/*'] },
  { files: ['**/*.{js,mjs,cjs,ts,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  jsPlugin.configs.recommended,
  ...tsEslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  jsxA11yPlugin.flatConfigs.recommended,
  {
    plugins: {
      'react-hooks': hooksPlugin,
      'css-modules': cssModulesPlugin,
      'simple-import-sort': simpleImportSortPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
      eqeqeq: 'error',
      camelcase: 'error',
      'no-console': 'warn',
      'no-else-return': 'error',
      'no-nested-ternary': 'error',
      'no-implicit-coercion': ['error', { allow: ['!!'] }],
      'no-duplicate-imports': 'error',
      'css-modules/no-unused-class': 'error',
      'css-modules/no-undef-class': 'error',
      'import/no-anonymous-default-export': 'off',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react.*$', '^@?\\w'],
            ['^@/app'],
            ['^@/pages'],
            ['^@/widgets'],
            ['^@/features'],
            ['^@/entities'],
            ['^@/shared'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.scss$'],
          ],
        },
      ],
    },
  },
]
