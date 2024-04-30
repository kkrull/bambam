# Task Automation

This project uses `npm` to automate common development tasks. See [Usage](./usage.md) for how to
run the project.

## `npm ci`

Install Node.js packages, using the same versions listed in the lock file.

## `npm run format`

Re-format files in place.

## `npm run format:check`

CI-ready script that checks for improperly formatted files.

## `npm run lint`

CI-ready script that checks for linting errors.

## `npm run lint:fix`

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

## `npm run test:ci`

CI-ready script that runs tests and writes a test report to `output/`.

## `npm run test:focus`

Run scenarios tagged with `@focus`.

## `npm run types:check`

CI-ready script that checks for type safety issues.

## `npm run types:watch`

Watch known source files, reporting any type issues live.
