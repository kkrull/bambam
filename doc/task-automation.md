# Task Automation

This project uses `npm` to automate common development tasks.

## `npm ci`

Install Node.js packages, using the same versions listed in the lock file.

## `npm run build`

Compile TypeScript code to `dist/`.

## `npm run clean`

Remove emitted JavaScript code from the TypeScript compiler.

## `npm run prettier:write`

Re-format files in place.

## `npm run prettier:list-different`

CI-ready script that checks for improperly formatted files.

## `npm run eslint`

CI-ready script that checks for linting errors.

## `npm run eslint:fix`

Automatically fix linting errors, where possible.

## `npm run test`

### Default: run everything

Run all Cucumber scenarios.

### Custom run

Pass custom options to `cucumber.js`:

```sh
npm run test -- --format usage
```

### Data sources

Cucumber scenarios can be tagged as follows, to change where data is sourced:

- `@FileMidiSource`: Read MIDI data from an actual file
- `@StaticMidiSource`: Build MIDI data inside the test

See `MidiSourceHooks.ts` for details.

## `npm run cucumber:format-html`

CI-ready script that runs tests and writes a test report to `output/`.

## `npm run cucumber:focus`

Run scenarios tagged with `@focus`.

## `npm run tsc:no-emit`

CI-ready script that checks for type safety issues.

## `npm run tsc:watch`

Watch known source files, reporting any type issues live.
