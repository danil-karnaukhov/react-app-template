export default {
  '*': 'prettier --write --ignore-unknown',
  '*.{js,mjs,cjs,ts,tsx}': 'eslint --fix',
  '*.scss': 'stylelint --fix',
}
