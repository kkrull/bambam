//https://github.com/okonet/lint-staged#configuration
module.exports = {
  //Format code before running the style-based that happen during linting
  '*.cjs': ['prettier --write', 'eslint --cache --fix'],
  '*.md': ['prettier --write', 'markdownlint-cli2 .markdownlint.json'],
  '*.ts': [
    'prettier --write',
    'eslint --cache --fix',
    () => 'tsc --noEmit -p tsconfig.json -p features/tsconfig.json',
  ],
};
