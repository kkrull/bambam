import eslint from '@eslint/js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

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

export default tsEslint.config(
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      ...allowUnusedIgnoreVariables,
      ...youTryWritingStepDefinitionsIn80CharsOrLess,
    },
  },
);
