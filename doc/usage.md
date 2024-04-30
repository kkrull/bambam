# Usage

This project uses `npm` to run the code, much like other development tasks.

## `npm run main:list-chunks <MIDI file>`

List chunks in a MIDI file.

```sh
npm run main:list-chunks features/data/ezd-mapping.mid
```

## `npm run main:list-events <MIDI file>`

List events in a MIDI file.

```sh
npm run main:list-events features/support/midi-source/mapping/modern-original-mix-type-1.mid
```

### Pro-tip: filter and format with `jq`

Use `jq` to at least pretty-print the JSON object, so you have a fighting change of reading it.

```sh
npm run --silent main:list-events features/support/midi-source/mapping/modern-original-mix-type-1.mid | jq
```

You can also use `jq` to select the specific you want:

```sh
npm run --silent main:list-events features/support/midi-source/mapping/modern-original-mix-type-1.mid \
  | jq '.tracks[1].events[] | { channel: .channel, deltaTime: .deltaTime, note: .note, type: .eventType, subType: .subType, velocity: .velocity }'
```
