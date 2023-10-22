import { FileHandle } from 'fs/promises';
import { Log } from '@src/main/Log';
import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import {
  openFile,
  readChunk,
  writeString,
  writeUInt32,
} from '@src/midi/io/io-fns';
import { readEvents } from '@src/midi/track/track-fns';
import { parseHeader } from '@src/midi/header/header-fns';
import { MidiTrackBuilder } from '@src/midi/track/MidiTrackBuilder';
import { EZDrummerMidiMap } from '@src/ezd-mapper/EZDrummerMidiMap';
import { Division } from '@src/midi/header/HeaderChunk';
import { MidiTrack } from '@src/midi/track/MidiTrack';

//Copy events from a MIDI file to make sure they are brought to me...unspoiled.
class RemapEventsCommand {
  static parseArgv(log: Log, argv: string[]): Promise<RemapEventsCommand> {
    if (argv.length !== 4) {
      return Promise.reject(
        `Usage ${argv[0]} ${argv[1]} <source file> <target file>`,
      );
    }

    return Promise.resolve(new RemapEventsCommand(log, argv[2], argv[3]));
  }

  constructor(
    private readonly log: Log,
    readonly sourceFilename: string,
    readonly targetFilename: string,
  ) {}

  async run(): Promise<void> {
    const sourceFile = await openFile(this.sourceFilename, 'r');
    const targetFile = await openFile(this.targetFilename, 'w');

    //Write header
    const headerChunk = await readChunk(sourceFile);
    const numBytesWritten = await headerChunk.write(targetFile);
    this.log(`Wrote ${numBytesWritten} bytes`);

    //Write track 0 (meta data)
    const metaTrackChunk = await readChunk(sourceFile);
    this.log(`${metaTrackChunk.typeName} [${metaTrackChunk.length} bytes]`);

    let numBytes = await this.writeTrackPreamble(targetFile, metaTrackChunk);
    for (const event of readEvents(metaTrackChunk)) {
      const eventBytes = await event.write(targetFile);
      numBytes += eventBytes;
    }
    this.log(`Wrote ${numBytes} bytes`);

    //Write track 1 (with notes)
    const { division } = parseHeader(headerChunk);
    let trackChunk = await readChunk(sourceFile);
    while (!trackChunk.isEmpty()) {
      this.log(`${trackChunk.typeName} [${trackChunk.length} bytes]`);
      let totalBytes = await this.writeTrackPreamble(targetFile, trackChunk);

      const ezDrummerTrack = this.parseTrack(division, trackChunk);
      const gmTrack = this.remapTrack(ezDrummerTrack);
      for (const event of gmTrack.allEvents()) {
        const eventBytes = await event.write(targetFile);
        totalBytes += eventBytes;
      }

      this.log(`Wrote ${totalBytes} bytes`);
      trackChunk = await readChunk(sourceFile);
    }

    await targetFile.close();
    await sourceFile.close();
  }

  private parseTrack(division: Division, trackChunk: MidiChunk): MidiTrack {
    const track = new MidiTrackBuilder();
    track.withDivisionInTicks(division.ticksPerQuarterNote);
    readEvents(trackChunk).forEach((x) => track.addMidiEvent(x));
    return track.build();
  }

  private remapTrack(sourceTrack: MidiTrack): MidiTrack {
    const midiMap = EZDrummerMidiMap.version2Map();
    return sourceTrack.remap(midiMap);
  }

  private async writeTrackPreamble(
    file: FileHandle,
    chunk: MidiChunk,
  ): Promise<number> {
    const typeSize = await writeString(file, chunk.typeName);
    const lengthSize = await writeUInt32(file, chunk.length);
    return typeSize + lengthSize;
  }
}

(async () => {
  const command = await RemapEventsCommand.parseArgv(console.log, process.argv);
  await command.run();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
