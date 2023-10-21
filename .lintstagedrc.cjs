//Use lambda to avoid error TS5042 (passing project file and sources to check)
const typeCheckWholeProject = () =>
  'tsc --noEmit -p tsconfig.json -p features/tsconfig.json';

//https://github.com/okonet/lint-staged#configuration
module.exports = {
  //Format code first, in case that triggers lint errors
  '*.cjs': ['prettier --write', 'eslint --cache --fix'],
  '*.json': ['prettier --write'],
  '*.md': ['prettier --write', 'markdownlint-cli2 .markdownlint.json'],
  '*.ts': ['prettier --write', 'eslint --cache --fix', typeCheckWholeProject],
};
