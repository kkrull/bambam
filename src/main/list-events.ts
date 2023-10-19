import { FileHandle } from 'fs/promises';
import {
  openFile,
  parseHeader,
  readChunk,
  readEvents,
} from '../midi/track/midi-fns';
import { MidiChunk } from '../midi/track/MidiChunk';
import { Log } from './Log';

//Lists the events in MIDI tracks.
class ListEventsCommand {
  static parseArgv(argv: string[]): Promise<ListEventsCommand> {
    if (argv.length !== 3) {
      return Promise.reject(`Usage ${argv[0]} ${argv[1]} <MIDI file>`);
    }

    return Promise.resolve(new ListEventsCommand(argv[2]));
  }

  constructor(readonly filename: string) {}

  async run(log: Log): Promise<void> {
    const file = await openFile(this.filename);
    const contents = await this.fileToObject(file);
    log(JSON.stringify(contents));
    await file.close();
  }

  private async fileToObject(file: FileHandle): Promise<object> {
    const headerChunk = await readChunk(file);
    const trackChunks = await this.readTracks(file);
    return {
      header: parseHeader(headerChunk),
      tracks: trackChunks.map((x) => this.trackToObject(x)),
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

  private trackToObject(chunk: MidiChunk): object {
    return {
      events: readEvents(chunk),
    };
  }
}

(async () => {
  const command = await ListEventsCommand.parseArgv(process.argv);
  await command.run(console.log);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
