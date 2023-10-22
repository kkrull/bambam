import { Log } from '@src/main/Log';
import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { openFile, readChunk } from '@src/midi/io/io-fns';
import { readEvents } from '@src/midi/track/track-fns';
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

    const headerChunk = await readChunk(sourceFile);
    const numBytesWritten = await headerChunk.write(targetFile);
    this.log(`Wrote ${numBytesWritten} bytes`);

    let trackChunk = await readChunk(sourceFile);
    while (!trackChunk.isEmpty()) {
      this.log(`${trackChunk.typeName} [${trackChunk.length} bytes]`);

      let totalBytes = await this.writeTrackPreamble(targetFile, trackChunk);
      for (const event of readEvents(trackChunk)) {
        const eventBytes = await event.write(targetFile);
        totalBytes += eventBytes;
      }

      this.log(`Wrote ${totalBytes} bytes`);
      trackChunk = await readChunk(sourceFile);
    }

    await targetFile.close();
    await sourceFile.close();
  }

  private async writeTrackPreamble(
    file: FileHandle,
    chunk: MidiChunk,
  ): Promise<number> {
    const writeType = await file.write(this.typeNameBuffer(chunk.typeName));
    const writeLength = await file.write(this.lengthBuffer(chunk.length));
    return writeType.bytesWritten + writeLength.bytesWritten;
  }

  private lengthBuffer(length: number): Buffer {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32BE(length);
    return buffer;
  }

  private typeNameBuffer(typeName: string): Buffer {
    return Buffer.from(typeName, 'latin1');
  }
}

(async () => {
  const command = await CopyEventsCommand.parseArgv(console.log, process.argv);
  await command.run();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
