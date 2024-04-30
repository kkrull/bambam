# Bam Bam

Converts a MIDI drum track from one drum sample map to another.

You can go from any format to any other format, as long as you start with EZDrummer 2's Modern
Original Mix and map to General MIDI Percussion. In other words, this currently only supports a
one-way mapping between two specific formats.

## Contents

- `.github/workflows`: GitHub Actions configuration that checks and builds code.
- `data/`: Data to use for development.
  - `ezdrummer-2/`: REAPER project used to create MIDI files for testing.
  - `private/`: A convenient place to keep private data without adding it to the repository.
- [`doc/`](#documentation): Documentation.
- `features/`: Feature and discovery tests, along with code specific to those.
- [`src/`](./doc/architecture.md#02-code-structure): Code.
  - `ezd-mapper/`: MIDI mapper for EZDrummer 2 to General MIDI Percussion.
  - `main/`: Top-level scripts to call from `package.json`.
  - `midi/`: Abstract data model and core logic.

## Documentation

- [Architecture](./doc/architecture.md): Descisions about how to structure the code.
- [MIDI Reference](./doc/midi.md): Some notes about MIDI that were useful during development.
- [Roadmap](./doc/roadmap.md): Some ways to make this code more useful, if development resumes.
- [Task Automation](./doc/task-automation.md): Automation for common development tasks.
- [Tools](./doc/tools.md): Tools to set up, in order to develop code in this project.
- [Usage](./doc/usage.md): How to run this thing, so you can re-map your drum track and get back to
  production.
