import { Log } from '@src/main/Log';
import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { openFile, readChunks } from '@src/midi/file/file-fns';
import { FileHandle } from 'node:fs/promises';

//Copies a MIDI file to make sure events are brought to me...unspoiled.
class CopyFileCommand {
  static parseArgv(log: Log, argv: string[]): Promise<CopyFileCommand> {
    if (argv.length !== 4) {
      return Promise.reject(
        `Usage ${argv[0]} ${argv[1]} <source file> <target file>`,
      );
    }

    return Promise.resolve(new CopyFileCommand(log, argv[2], argv[3]));
  }

  constructor(
    private readonly log: Log,
    readonly sourceFilename: string,
    readonly targetFilename: string,
  ) {}

  async run(): Promise<void> {
    const sourceFile = await openFile(this.sourceFilename, 'r');
    const targetFile = await openFile(this.targetFilename, 'w');
    for (const chunk of await readChunks(sourceFile)) {
      await this.copyChunk(chunk, targetFile);
    }

    await targetFile.close();
    await sourceFile.close();
  }

  async copyChunk(chunk: MidiChunk, targetFile: FileHandle): Promise<void> {
    this.log(`${chunk.typeName} [${chunk.length} bytes]`);
    const numBytesWritten = await chunk.write(targetFile);
    this.log(`Wrote ${numBytesWritten} bytes`);
  }
}

(async () => {
  const command = await CopyFileCommand.parseArgv(console.log, process.argv);
  await command.run();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
