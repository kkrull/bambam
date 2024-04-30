# Task Automation

This project uses `npm` to automate common development tasks.

## `npm ci`

Install Node.js packages, using the same verisons listed in the lock file.

```sh
npm ci
```

## `npm run format`

Re-format files in place.

```sh
npm run format
```

## `npm run format:check`

CI-ready script that checks for improperly formatted files.

```sh
npm run format:check
```

## `npm run lint`

CI-ready script that checks for linting errors.

```sh
npm run lint
```

## `npm run lint:fix`

Automatically fix linting errors, where possible.

```sh
npm run lint:fix
```

## `npm run test [--] [...arguments]`

### Default: run everything

Run all Cucumber scenarios.

```sh
npm run test
```

### Custom run

Pass custom options to `cucumber.js`:

```sh
npm run test -- [...cucumber.js args]
```

### Data sources

Cucumber scenarios can be tagged as follows, to change where data is sourced:

- `@FileMidiSource`: Read MIDI data from an actual file
- `@StaticMidiSource`: Build MIDI data inside the test

See `MidiSourceHooks.ts` for details.

## `npm run test:focus`

Run scenarios tagged with `@focus`.

```sh
npm run test:focus
```

## `npm run types:check`

CI-ready script that checks for type safety issues.

```sh
npm run types:check
```

## `npm run types:watch`

Watch known source files, reporting any type issues live.

```sh
npm run types:watch
```
