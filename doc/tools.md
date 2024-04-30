# Tools

These tools are used for the project. Look here for references to documentation
and key configuration files.

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
  - `features/cucumber.cjs`: configuration file for where to find tests and
    support code
  - `features/tsconfig.json`: TypeScript configuration
- Node packages:
  - `@cucumber/*` provides
    [cucumber](https://github.com/cucumber/cucumber-js/tree/main/docs) and
    formatters, which make the output on the command line look nice.
  - `ts-node` adds TypeScript support to `cucumber-js`.
  - `tsconfig-paths` allows TypeScript sources in `features/` to use path
    aliases to production code sources.
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
  - `.eslintrc.cjs`: configuration file
- Node packages:
  - `eslint`: main package
  - `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` add
    support for TypeScript.

## GitHub Actions

_Performs Continuous Integration / Continuous Deployment (CI/CD)._

- Files:
  - `.github/workflows`: Workflow definitions

## Husky

_Adds a Git pre-commit hook that runs checks on staged files, before committing
to the repository._

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
  - `package.json`: package properties, dependencies, and task automation (e.g.
    scripts)

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

## TypeScript

_Adds static typing to JavaScript._

- Documentation:
  - Configuration (`tsconfig.json`): <https://www.typescriptlang.org/tsconfig>
- Files:
  - `tsconfig.json` - configuration file for sources in `src/`
  - `features/tsconfig.json` - configuration file for sources in `features/`
- Node packages:
  - `typescript`: main package
  - `@tsconfig/node18`: base configuration for the version of node.js we're
    using here
  - `@types/*`: type definitions for all the other packages we're using
  - [`tsconfig-paths`](https://www.npmjs.com/package/tsconfig-paths#with-ts-node):
    allows TypeScript sources to use path aliases at runtime, using `ts-node
-r`.
