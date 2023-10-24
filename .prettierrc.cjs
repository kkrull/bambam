/** @type {import("prettier").Config} */
const config = {
  plugins: [
    //https://www.npmjs.com/package/prettier-plugin-organize-imports
    'prettier-plugin-organize-imports',
  ],
  singleQuote: true,
};

module.exports = config;
