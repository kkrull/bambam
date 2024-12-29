import { EZDrummerMidiMap } from '@src/ezd-mapper/EZDrummerMidiMap';
import { Log } from '@src/main/Log';
import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { parseHeader, parseTrack } from '@src/midi/chunk/midi-chunk-fns';
import { openFile, readChunks } from '@src/midi/file/file-fns';
import { Division, HeaderChunk } from '@src/midi/header/HeaderChunk';
import { MidiTrack } from '@src/midi/track/MidiTrack';
import { toChunk } from '@src/midi/track/track-fns';
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

    const chunks = await readChunks(sourceFile);
    const { division, format } = await this.copyHeader(
      chunks.shift() || MidiChunk.null(),
      targetFile,
    );

    switch (format) {
      case 0:
        //Single-track (multi-channel) file; no tempo track to skip
        break;
      case 1:
        //Skip tempo track in multi-track file
        await this.copyTrack(
          chunks.shift() || MidiChunk.null(),
          targetFile,
          division,
        );
        break;
      default:
        throw Error(`Unsupported format: ${format}`);
    }

    //Percussion track(s)
    for (const sourceTrackChunk of chunks) {
      this.logChunkSize(sourceTrackChunk);

      const sourceTrack = parseTrack(sourceTrackChunk, division);
      const targetTrack = this.remapTrack(sourceTrack);
      const targetTrackChunk = toChunk(targetTrack);
      const trackBytes = await targetTrackChunk.write(targetFile);

      this.log(`Wrote ${trackBytes} bytes`);
    }

    await targetFile.close();
    await sourceFile.close();
  }

  private async copyHeader(
    headerChunk: MidiChunk,
    targetFile: FileHandle,
  ): Promise<HeaderChunk> {
    const headerSize = await headerChunk.write(targetFile);
    this.log(`Wrote ${headerSize} bytes`);
    return parseHeader(headerChunk);
  }

  private async copyTrack(
    sourceTrackChunk: MidiChunk,
    targetFile: FileHandle,
    division: Division,
  ): Promise<void> {
    this.logChunkSize(sourceTrackChunk);

    const sourceTrack = parseTrack(sourceTrackChunk, division);
    const targetTrackChunk = toChunk(sourceTrack);
    const trackBytes = await targetTrackChunk.write(targetFile);

    this.log(`Wrote ${trackBytes} bytes`);
  }

  private logChunkSize(chunk: MidiChunk): void {
    this.log(`${chunk.typeName} [${chunk.length}/${chunk.totalSize} bytes]`);
  }

  private remapTrack(track: MidiTrack): MidiTrack {
    const midiMap = EZDrummerMidiMap.version2Map();
    return track.remap(midiMap);
  }
}

(async () => {
  const command = await RemapEventsCommand.parseArgv(console.log, process.argv);
  await command.run();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
