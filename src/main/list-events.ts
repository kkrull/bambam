import { FileHandle } from 'fs/promises';
import {
  openFile,
  parseHeader,
  readChunk,
  readEvents,
} from '../midi/track/midi-fns';
import { MidiChunk } from '../midi/track/MidiChunk';

class ListEventsCommand {
  static parseArgv(argv: string[]): ListEventsCommand {
    if (argv.length !== 3) {
      throw Error(`Usage ${argv[0]} ${argv[1]} <MIDI file>`);
    }

    return new ListEventsCommand(argv[2]);
  }

  constructor(readonly filename: string) {}

  async run(): Promise<void> {
    const file = await openFile(this.filename);
    const contents = await this.fileToObject(file);
    console.log(JSON.stringify(contents));
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

(async (command: ListEventsCommand) => {
  await command.run();
})(ListEventsCommand.parseArgv(process.argv));
