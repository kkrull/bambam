# Bam Bam

Converts a MIDI drum track from one drum sample map to another.

Why? Because nothing erases the stank-face of a tasty guitar riff faster than replacing a
thunderous rimshot on the toms with a vibraslap, when you least expected it.

You can go from any format to any other format, as long as you start with EZDrummer 2's Modern
Original Mix and map to General MIDI Percussion. In other words, this currently only supports a
one-way mapping between two specific formats.

## Continuous Integration

Builds run with GitHub Actions:

- Configuration: [`.github/workflows/`](./.github/workflows/)
- Dashboard: <https://github.com/kkrull/bambam/actions>

## Documentation

Reading these might help you use and/or work on the code here:

- [Architecture](./doc/architecture.md): Decisions about how to structure the code.
- [MIDI Reference](./doc/midi.md): Some notes about MIDI that were useful during development.
- [Roadmap](./doc/roadmap.md): Some ways to make this code more useful, if development resumes.
- [Task Automation](./doc/task-automation.md): Automation for common development tasks.
- [Tools](./doc/tools.md): Tools to set up, in order to develop code in this project.
- [Usage](./doc/usage.md): How to run this thing, so you can re-map your drum track and get back to
  production.

## Installation

### Install as an npm module

Bam Bam does not currently support being used as a library in other projects (e.g. `npm install
bambam`), due to a lack of index files.

### Install as a linked node module

Bam Bam is meant to be used as a set of CLI tools that run on a system-installed version of Node.js.
You can install it for use by:

- Double-check your terminal is currently configured for the version of Node you want to use for Bam
  Bam (e.g. one that will always be on your system path).
- Clone this repository.
- Inside your working copy of this repository:
  - `npm install`: Install packages needed to build these sources.
  - `make`: Compile TypeScript sources down to JavaScript, so it runs on Node.js without installing
    separate tooling for TypeScript.
  - `make install`: Create global links in your Node.js installation to the scripts in `bin/`.
- Double-check that Node's links are on your system path. A path similar to
  `/Users/me/.nvm/versions/node/v18.20.7/bin` should be listed in `$PATH` (`bash`) or `$path`
  (`zsh`).
- Re-start your terminal and/or source your dotfiles, if necessary, to update your system path.

## Sources

Here is how the files in this repository are organized:

- `.github/workflows`: GitHub Actions configuration that builds, checks, and tests the code.
- `bin/`: Wrapper scripts that invoke the various sources in `src/main/` that have been compiled to
  `dist/`.
- `data/`: Data to use for development.
  - `ezdrummer-2/`: REAPER project used to create MIDI files for testing.
  - `private/`: A convenient place to keep private data without adding it to the repository.
- `dist/`: JavaScript code emitted from TypeScript sources in `src/`.
- `doc/`: Documentation.
- `features/`: Feature and discovery tests, along with code specific to those.
- `src/`: Code.
  - `ezd-mapper/`: MIDI mapper for EZDrummer 2 to General MIDI Percussion.
  - `main/`: Top-level scripts to call from `package.json`.
  - `midi/`: Abstract data model and core logic.

## Usage

The main reason for this code is to [re-map events](./doc/usage.md#remap-events).

See the [Usage Guide](./doc/usage.md) for other things this code can do.
