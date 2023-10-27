import { FileHandle } from 'node:fs/promises';

import { Log } from '@src/main/Log';
import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { parseHeader, readEvents } from '@src/midi/chunk/midi-chunk-fns';
import { openFile, readChunks } from '@src/midi/file/file-fns';

//Lists the events in MIDI tracks.
class ListEventsCommand {
  static parseArgv(log: Log, argv: string[]): Promise<ListEventsCommand> {
    if (argv.length !== 3) {
      return Promise.reject(`Usage ${argv[0]} ${argv[1]} <MIDI file>`);
    }

    return Promise.resolve(new ListEventsCommand(log, argv[2]));
  }

  constructor(
    private readonly log: Log,
    readonly filename: string,
  ) {}

  async run(): Promise<void> {
    const file = await openFile(this.filename);
    const contents = await this.fileToObject(file);
    this.log(JSON.stringify(contents));
    await file.close();
  }

  private async fileToObject(file: FileHandle): Promise<object> {
    const chunks = await readChunks(file);
    const trackChunks = chunks.slice(1);
    return {
      header: parseHeader(chunks[0]),
      tracks: trackChunks.map((x, i) => this.trackToObject(x, i + 1)),
    };
  }

  private trackToObject(chunk: MidiChunk, trackNum: number): object {
    return {
      events: readEvents(chunk),
      number: trackNum,
    };
  }
}

(async () => {
  const command = await ListEventsCommand.parseArgv(console.log, process.argv);
  await command.run();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
