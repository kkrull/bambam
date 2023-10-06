const allowUnusedIgnoreVariables = {
  'no-unused-vars': 'off', //avoid false positives from the base rule
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
};

const youTryWritingStepDefinitionsIn80CharsOrLess = {
  'max-len': ['warn', { code: 100 }],
};

/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    ...allowUnusedIgnoreVariables,
    ...youTryWritingStepDefinitionsIn80CharsOrLess,
  },
};
