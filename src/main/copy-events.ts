import { Log } from '@src/main/Log';
import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { parseHeader, parseTrack } from '@src/midi/chunk/midi-chunk-fns';
import { openFile, readChunks } from '@src/midi/file/file-fns';
import { MidiTrack } from '@src/midi/track/MidiTrack';
import { toChunk } from '@src/midi/track/track-fns';
import { FileHandle } from 'fs/promises';

//Copy events from a MIDI file to make sure they are brought to me...unspoiled.
class CopyEventsCommand {
  static parseArgv(log: Log, argv: string[]): Promise<CopyEventsCommand> {
    if (argv.length !== 4) {
      return Promise.reject(
        `Usage ${argv[0]} ${argv[1]} <source file> <target file>`,
      );
    }

    return Promise.resolve(new CopyEventsCommand(log, argv[2], argv[3]));
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
    const headerChunk = chunks[0];
    await this.writeChunk(headerChunk, targetFile);

    const { division } = parseHeader(headerChunk);
    for (const trackChunk of chunks.slice(1)) {
      this.log(`${trackChunk.typeName} [${trackChunk.length} bytes]`);
      const track = parseTrack(trackChunk, division);
      await this.writeTrack(track, targetFile);
    }

    await targetFile.close();
    await sourceFile.close();
  }

  private async writeChunk(headerChunk: MidiChunk, targetFile: FileHandle) {
    const numBytesWritten = await headerChunk.write(targetFile);
    this.log(`Wrote ${numBytesWritten} bytes`);
  }

  private async writeTrack(track: MidiTrack, targetFile: FileHandle) {
    const targetTrackChunk = toChunk(track);
    const trackBytes = await targetTrackChunk.write(targetFile);
    this.log(`Wrote ${trackBytes} bytes`);
  }
}

(async () => {
  const command = await CopyEventsCommand.parseArgv(console.log, process.argv);
  await command.run();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
