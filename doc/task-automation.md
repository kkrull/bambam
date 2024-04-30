# Task Automation

## Format code

```sh
#Re-format files in place
npm run format

#CI-ready script that checks for improperly formatted files
npm run format:check
```

## Install packages

```sh
npm install

#Make sure only the declared packages are installed (good for CI)
npm ci
```

## Lint code

```sh
#CI-ready script that checks for linting errors
npm run lint

#Automatically fix linting errors, where possible
npm run lint:fix
```

## Run scripts

There's a utility script in `src/main/` that helps inspect MIDI files.

```sh
#List chunks
npm run main:list-chunks features/data/ezd-mapping.mid

#List events
npm run main:list-events features/support/midi-source/mapping/modern-original-mix-type-1.mid
npm run --silent main:list-events features/support/midi-source/mapping/modern-original-mix-type-1.mid | jq
npm run --silent main:list-events features/support/midi-source/mapping/modern-original-mix-type-1.mid \
  | jq '.tracks[1].events[] | { channel: .channel, deltaTime: .deltaTime, note: .note, type: .eventType, subType: .subType, velocity: .velocity }'
```

## Test code

```sh
#Run all Cucumber scenarios
npm run test

#Run scenarios tagged with @focus
npm run test:focus

#Pass custom options to cucumber.js
npm run test -- [...cucumber.js args]
```

Cucumber scenarios can be tagged as follows, to change where data is sourced:

- `@FileMidiSource`: Read MIDI data from an actual file
- `@StaticMidiSource`: Build MIDI data inside the test

See `MidiSourceHooks.ts` for details.

## Type-check code

```sh
#CI-ready script that checks for type safety issues
npm run types:check

#Watch known source files, reporting any type issues live
npm run types:watch
```
