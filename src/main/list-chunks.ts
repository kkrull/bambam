import { MidiChunk } from '../midi/track/MidiChunk';
import { openFile, readChunk } from '../midi/track/midi-fns';
import { Log } from './Log';

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
    const headerChunk = await readChunk(file);
    this.logChunk(headerChunk);

    let chunk = await readChunk(file);
    while (!chunk.isEmpty()) {
      this.log();
      this.logChunk(chunk);

      chunk = await readChunk(file);
    }

    await file.close();
  }

  logChunk(chunk: MidiChunk): void {
    this.log(`${chunk.typeName}: ${chunk.length} bytes`);
    chunk.data
      .asHexRows(16)
      .map((hexRow, i) => `${i * 16}:\t${hexRow.join(' ')}`)
      .forEach((line) => this.log(line));
  }
}

(async () => {
  const command = await ListChunksCommand.parseArgv(console.log, process.argv);
  await command.run();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
