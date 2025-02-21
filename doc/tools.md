# Tools

Tools used for this project, in hopes of making life [easier on
developers](./architecture.md#01-use-tools).

Look here for references to documentation and key configuration files.

## Code Spell Checker

_Identifies words that may be misspelled._

- Documentation: <https://github.com/streetsidesoftware/vscode-spell-checker>
- Files:
  - `cspell.json`: configuration file and dictionary
- VS Code extension:
  <https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker>

## Cucumber

_Runs BDD tests with Gherkin syntax._

- Files:
  - `features/cucumber.cjs`: configuration file for where to find tests and support code
  - `features/tsconfig.json`: TypeScript configuration
- Node packages:
  - `@cucumber/*` provides [cucumber](https://github.com/cucumber/cucumber-js/tree/main/docs) and
    formatters, which make the output on the command line look nice.
  - `ts-node` adds TypeScript support to `cucumber-js`.
  - `tsconfig-paths` allows TypeScript sources in `features/` to use path aliases to production code
    sources.
- Interactions:
  - [TypeScript](#running-with-path-aliases)
- VS Code Extension:
  <https://marketplace.visualstudio.com/items?itemName=CucumberOpen.cucumber-official>

## `direnv`

_Integrates environment management with your shell (e.g. `bash` or `zsh`)._

- Files:
  - `.envrc`: configuration script
- Installation:
  - Homebrew: `brew install direnv`
  - **Note: Follow instructions about updating `.bashrc` or `.zshrc`**

## EditorConfig

_Defines basic parameters for formatting source files._

- Files:
  - `.editorconfig`: configuration file

## ESLint

_Performs static analysis and style checks._

- Files:
  - `eslint.config.mjs`: configuration file
- Node packages:
  - `eslint`: main package
  - `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` add
    support for TypeScript.

### VS Code integration

This project uses the flat configuration file (instead of `.eslintrc`) that will be used for ESLint
9+. VS Code needs to be configured to look for that configuration, instead of assuming its own:
<https://eslint.org/blog/2023/10/flat-config-rollout-plans/>.

## GitHub Actions

_Performs Continuous Integration / Continuous Deployment (CI/CD)._

- Files:
  - `.github/workflows`: Workflow definitions

## Husky

_Adds a Git pre-commit hook that runs checks on staged files, before committing to the repository._

- Files:
  - `.husky/pre-commit`: The actual pre-commit script
  - `package.json` also has a `prepare` script that installs the Git hook.
- Node packages:
  - `husky`: main package

## `lint-staged`

_Runs the actual checks on source files staged for the next Git commit._

- Files:
  - `.lintstagedrc.cjs`: configuration file
- Node packages:
  - `lint-staged`: main package

## Markdownlint

_Checks Markdown files for style or formatting errors._

- Documentation:
  - Main: <https://github.com/DavidAnson/markdownlint>
  - Rules: <https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md>
- Files:
  - `.markdownlint.json`: configuration file
- VS Code extension:
  <https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint>

## Node.js

_Node.js is the runtime platform._

- Files:
  - `package.json`: package properties, dependencies, and task automation (e.g. scripts)

## Node Version Manager (`nvm`)

_Installs a known version of Node.js and configures your shell to use it._

- Files
  - `.nvmrc`: configuration file

## Prettier

_Formats source files._

- Documentation:
  - Options: <https://prettier.io/docs/en/options.html>
- Files:
  - `.prettierignore`: which files should be skipped, while formatting
  - `.prettierrc.cjs`: configuration file
- Node packages:
  - `prettier`: main package

### VS Code Integration

VS Code has an extension for `prettier` and `editorConfig`, as well as built-in formatters for JSON
files. The latter tends to conflict with prettier's rules, so saving a file in VS Code tends to
reformat JSON files like `tsconfig.json` in a way that `prettier` will later reject.

To fix this, run the action `Format Document with...` and choose `prettier` as the default
formatter. For details, see here: <https://stackoverflow.com/q/52586965/112682>.

## TypeScript

_Adds static typing to JavaScript._

- Documentation:
  - Configuration (`tsconfig.json`): <https://www.typescriptlang.org/tsconfig>
- Files:
  - `tsconfig.json` - configuration file for sources in `src/`
  - `features/tsconfig.json` - configuration file for sources in `features/`
- Node packages:
  - `typescript`: main package
  - `@tsconfig/node18`: base configuration for the version of node.js we're using here
  - `@types/*`: type definitions for all the other packages we're using
  - [`tsconfig-paths`](https://www.npmjs.com/package/tsconfig-paths#with-ts-node):
    allows TypeScript sources to use path aliases at runtime, using `ts-node -r`.

### Compiling with path aliases

This project uses [`tsc-alias`](https://www.npmjs.com/package/tsc-alias) to convert path aliases in
`tsconfig.compilerOptions.paths` and `require/import` statements in TypeScript code to relative path
imports in emitted JavaScript code.

### Running with path aliases

When running TypeScript directly (e.g. running one of the "main" scripts in `package.json`) or when
running [Cucumber](#cucumber), it is necessary to convert these path aliases at runtime.
[`ts-node`](https://www.npmjs.com/package/ts-node) does this, either by replacing the `node`
executable with `ts-node` or by requiring it when first starting (Cucumber).
