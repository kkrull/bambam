import { openFile, readChunk } from '../midi/track/midi-fns';

class ListChunksCommand {
  static parseArgv(argv: string[]): Promise<ListChunksCommand> {
    if (argv.length !== 3) {
      return Promise.reject(`Usage ${argv[0]} ${argv[1]} <MIDI file>`);
    }

    return Promise.resolve(new ListChunksCommand(argv[2]));
  }

  constructor(readonly filename: string) {}

  async run(): Promise<void> {
    const file = await openFile(this.filename);
    console.log(`Opening: ${this.filename}`);
    const headerChunk = await readChunk(file);
    console.log(`${headerChunk.typeName}: ${headerChunk.length} bytes`);

    let chunk = await readChunk(file);
    while (!chunk.isEmpty()) {
      console.log(`${chunk.typeName}: ${chunk.length} bytes`);
      chunk = await readChunk(file);
    }
  }
}

(async () => {
  const command = await ListChunksCommand.parseArgv(process.argv);
  await command.run();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
