import { FileHandle } from 'fs/promises';

import { Log } from '@src/main/Log';
import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { readEvents } from '@src/midi/chunk/midi-chunk-fns';
import {
  openFile,
  readChunks,
  writeString,
  writeUInt32,
} from '@src/midi/file/file-fns';

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
    const numBytesWritten = await headerChunk.write(targetFile);
    this.log(`Wrote ${numBytesWritten} bytes`);

    for (const trackChunk of chunks.slice(1)) {
      this.log(`${trackChunk.typeName} [${trackChunk.length} bytes]`);

      //TODO KDK: Bring back MidiEvent#write or change to MidiTrack#write and call this copy-tracks instead
      let totalBytes = await this.writeTrackPreamble(targetFile, trackChunk);
      for (const event of readEvents(trackChunk)) {
        const eventBytes = await event.write(targetFile);
        totalBytes += eventBytes;
      }

      this.log(`Wrote ${totalBytes} bytes`);
    }

    await targetFile.close();
    await sourceFile.close();
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
  const command = await CopyEventsCommand.parseArgv(console.log, process.argv);
  await command.run();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
