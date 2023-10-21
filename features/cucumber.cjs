//https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md#options
module.exports = {
  default: {
    format: ['@cucumber/pretty-formatter'],
    require: ['features/**/*.ts'],
    requireModule: ['ts-node/register', 'tsconfig-paths/register'],
    tags: 'not @skip',
  },
};
