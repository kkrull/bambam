const firstFormatWhichCanCauseLintErrors = 'prettier --write';
const thenEslint = 'eslint --cache --fix';

//Use lambda to avoid error TS5042 (passing project file and sources to check)
const typeCheckWholeProject = () =>
  'tsc --noEmit -p tsconfig.json -p features/tsconfig.json';

//https://github.com/okonet/lint-staged#configuration
module.exports = {
  '*.{cjs,mjs}': [firstFormatWhichCanCauseLintErrors, thenEslint],
  '*.json': [firstFormatWhichCanCauseLintErrors],
  '*.md': [
    firstFormatWhichCanCauseLintErrors,
    'markdownlint-cli2 --config .markdownlint.json',
  ],
  '*.ts': [
    firstFormatWhichCanCauseLintErrors,
    thenEslint,
    typeCheckWholeProject,
  ],
};
