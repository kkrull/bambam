# Task Automation

This project uses `npm` to automate common development tasks.

## Standard tasks

### `npm run build`

Compile TypeScript and make alterations so it runs plain JavaScript on Node.js without extra
tooling.

### `npm run check`

Run all checks, without changing anything.

### `npm run clean`

Remove emitted JavaScript code from the TypeScript compiler.

### `npm test` or `npm run test`

Runs `cucumber`.

### `npm run test:ci`

Runs `cucumber` in a mode suitable for Continuous Integration (e.g. it produces a test report and
avoids ANSI escape sequences).

## Cucumber tasks

### `npm run cucumber`

#### Default: run everything

Run all Cucumber scenarios.

#### Custom run

Pass custom options to `cucumber.js`:

```sh
npm run test -- --format usage
```

#### Data sources

Cucumber scenarios can be tagged as follows, to change where data is sourced:

- `@FileMidiSource`: Read MIDI data from an actual file
- `@StaticMidiSource`: Build MIDI data inside the test

See `MidiSourceHooks.ts` for details.

### `npm run cucumber:focus`

Run scenarios tagged with `@focus`.

### `npm run cucumber:format-html`

CI-ready script that runs tests and writes a test report to `output/`.

## ESLint tasks

### `npm run eslint`

CI-ready script that checks for linting errors.

### `npm run eslint:fix`

Automatically fix linting errors, where possible.

## `prettier` tasks

### `npm run prettier:list-different`

CI-ready script that checks for improperly formatted files.

### `npm run prettier:write`

Re-format files in place.

## TypeScript tasks

### `npm run tsc`

Compile TypeScript code to `dist/`.

### `npm run tsc:no-emit`

CI-ready script that checks for type safety issues.

### `npm run tsc:watch`

Watch known source files, reporting any type issues live.

### `npm run tsc-alias`

Convert path aliases in `require` statements into relative paths that can run on Node.js without
additional tooling.
