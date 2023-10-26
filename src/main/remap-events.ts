import { EZDrummerMidiMap } from '@src/ezd-mapper/EZDrummerMidiMap';
import { Log } from '@src/main/Log';
import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import {
  parseHeader,
  parseTrack,
  readEvents,
} from '@src/midi/chunk/midi-chunk-fns';
import { openFile, writeString, writeUInt32 } from '@src/midi/file/file-fns';
import { MidiTrack } from '@src/midi/track/MidiTrack';
import { FileHandle } from 'fs/promises';

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
    const headerChunk = await MidiChunk.read(sourceFile);
    const numBytesWritten = await headerChunk.write(targetFile);
    this.log(`Wrote ${numBytesWritten} bytes`);

    //Read track 0 (tempo track)
    const tempoTrackChunk = await MidiChunk.read(sourceFile);
    const payloadSize = tempoTrackChunk.length;
    const totalSize = tempoTrackChunk.length + 4 + 4;
    this.log(`${tempoTrackChunk.typeName} [${payloadSize}/${totalSize} bytes]`);

    //Write track 0 events (tempo track)
    let numBytes = await this.writeTrackPreamble(targetFile, tempoTrackChunk);
    for (const event of readEvents(tempoTrackChunk)) {
      const eventBytes = await event.write(targetFile);
      numBytes += eventBytes;
    }
    this.log(`Wrote ${numBytes} bytes`);

    //Write track 1 (with notes)
    const { division } = parseHeader(headerChunk);
    let trackChunk = await MidiChunk.read(sourceFile);
    while (!trackChunk.isEmpty()) {
      const payloadSize = trackChunk.length;
      const totalSize = trackChunk.length + 4 + 4;
      this.log(`${trackChunk.typeName} [${payloadSize}/${totalSize} bytes]`);
      let totalBytes = await this.writeTrackPreamble(targetFile, trackChunk);

      const ezDrummerTrack = parseTrack(trackChunk, division);
      const gmTrack = this.remapTrack(ezDrummerTrack);
      for (const event of gmTrack.allEvents()) {
        const eventBytes = await event.write(targetFile);
        totalBytes += eventBytes;
      }

      this.log(`Wrote ${totalBytes} bytes`);
      trackChunk = await MidiChunk.read(sourceFile);
    }

    await targetFile.close();
    await sourceFile.close();
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
