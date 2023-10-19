import { FileHandle } from 'fs/promises';
import { readEvents } from '../midi/track/track-fns';
import { openFile, readChunk } from '../io/io-fns';
import { parseHeader } from '../midi/header/header-fns';
import { MidiChunk } from '../midi/MidiChunk';
import { Log } from './Log';

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
    const headerChunk = await readChunk(file);
    const trackChunks = await this.readTracks(file);
    return {
      header: parseHeader(headerChunk),
      tracks: trackChunks.map((x, i) => this.trackToObject(x, i + 1)),
    };
  }

  private async readTracks(file: FileHandle): Promise<MidiChunk[]> {
    const trackChunks = [];
    let chunk = await readChunk(file);
    while (!chunk.isEmpty()) {
      trackChunks.push(chunk);
      chunk = await readChunk(file);
    }

    return trackChunks;
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
