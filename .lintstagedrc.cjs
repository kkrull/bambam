//https://github.com/okonet/lint-staged#configuration
module.exports = {
  '*.cjs': ['eslint --cache --fix', 'prettier --write'],
  '*.md': ['prettier --write'],
  '*.ts': [
    'eslint --cache --fix',
    'prettier --write',
    'tsc --noEmit -p tsconfig.json',
  ],
};
