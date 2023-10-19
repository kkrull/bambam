import { openFile, readChunk } from '../midi/track/midi-fns';
import { Log } from './Log';

//Lists the chunks in a MIDI file.
class ListChunksCommand {
  static parseArgv(argv: string[]): Promise<ListChunksCommand> {
    if (argv.length !== 3) {
      return Promise.reject(`Usage ${argv[0]} ${argv[1]} <MIDI file>`);
    }

    return Promise.resolve(new ListChunksCommand(argv[2]));
  }

  constructor(readonly filename: string) {}

  async run(log: Log): Promise<void> {
    const file = await openFile(this.filename);
    const headerChunk = await readChunk(file);
    log(`${headerChunk.typeName}: ${headerChunk.length} bytes`);
    headerChunk.data
      .asHexRows(16)
      .forEach((hexRow, i) => log(`${i * 16}:\t${hexRow.join(' ')}`));

    let chunk = await readChunk(file);
    while (!chunk.isEmpty()) {
      log();
      log(`${chunk.typeName}: ${chunk.length} bytes`);
      chunk.data
        .asHexRows(16)
        .forEach((hexRow, i) => log(`${i * 16}:\t${hexRow.join(' ')}`));

      chunk = await readChunk(file);
    }

    await file.close();
  }
}

(async () => {
  const command = await ListChunksCommand.parseArgv(process.argv);
  await command.run(console.log);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
