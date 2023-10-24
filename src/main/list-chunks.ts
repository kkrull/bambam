import { FileHandle } from 'node:fs/promises';

import { Log } from '@src/main/Log';
import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { parseHeader } from '@src/midi/header/header-fns';
import { HeaderChunk } from '@src/midi/header/HeaderChunk';
import { openFile } from '@src/midi/io/io-fns';
import { TickDivision } from '@src/midi/track/TickDivision';

//Lists the chunks in a MIDI file.
class ListChunksCommand {
  static parseArgv(log: Log, argv: string[]): Promise<ListChunksCommand> {
    if (argv.length !== 3) {
      return Promise.reject(`Usage ${argv[0]} ${argv[1]} <MIDI file>`);
    }

    return Promise.resolve(new ListChunksCommand(log, argv[2]));
  }

  constructor(
    private readonly log: Log,
    readonly filename: string,
  ) {}

  async run(): Promise<void> {
    const file = await openFile(this.filename);
    await this.logChunks(file);
    await file.close();
  }

  private async logChunks(file: FileHandle) {
    const headerChunk = await MidiChunk.read(file);
    this.logChunk(headerChunk);
    this.logHeaderChunk(headerChunk);

    let chunk = await MidiChunk.read(file);
    while (!chunk.isEmpty()) {
      this.log();
      this.logChunk(chunk);

      chunk = await MidiChunk.read(file);
    }
  }

  private logChunk(chunk: MidiChunk): void {
    this.log(`${chunk.typeName}: ${chunk.length} bytes`);
    chunk.data
      .asHexRows(16)
      .map((hexRow, i) => `${i * 16}:\t${hexRow.join(' ')}`)
      .forEach((line) => this.log(line));
  }

  private logHeaderChunk(headerChunk: MidiChunk): void {
    const header: HeaderChunk = parseHeader(headerChunk);
    this.log(`Format: ${this.describeFormat(header.format)}`);
    this.log(`Tracks: ${header.numTracks}`);
    this.log(`Time division: ${this.describeDivision(header.division)}`);
  }

  private describeDivision(division: TickDivision): string {
    return `${division.ticksPerQuarterNote} ticks per quarter note`;
  }

  private describeFormat(format: number): string {
    switch (format) {
      case 1:
        return `(1) Multi-track`;
      default:
        throw Error(`Unsupported format: ${format}`);
    }
  }
}

(async () => {
  const command = await ListChunksCommand.parseArgv(console.log, process.argv);
  await command.run();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
