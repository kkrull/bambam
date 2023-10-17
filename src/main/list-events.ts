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
    await this.listFileEvents(file);
    await file.close();
  }

  async listFileEvents(file: FileHandle): Promise<void> {
    const headerChunk = await readChunk(file);
    const { format, numTracks, division } = parseHeader(headerChunk);
    console.log(
      `Header: format=${format}, numTracks=${numTracks}, division=${JSON.stringify(
        division,
        null,
        2,
      )}`,
    );

    let trackChunk = await readChunk(file);
    while (!trackChunk.isEmpty()) {
      console.log();
      console.log('Track');
      this.listTrackEvents(trackChunk);
      trackChunk = await readChunk(file);
    }
  }

  //TODO KDK: List out the events, to use as a basis for updating StaticMappingMidiSource
  listTrackEvents(trackChunk: MidiChunk): void {
    readEvents(trackChunk).forEach((event) => {
      console.log(JSON.stringify(event, null, 2));
    });
  }
}

(async (command: ListEventsCommand) => {
  await command.run();
})(ListEventsCommand.parseArgv(process.argv));
