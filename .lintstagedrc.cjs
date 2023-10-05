//https://github.com/okonet/lint-staged#configuration
module.exports = {
  '*.{cjs,js,ts}': 'eslint --cache --fix',
  '*.{cjs,css,js,md,ts}': 'prettier --write',
};
