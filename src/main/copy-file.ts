import { FileHandle } from 'node:fs/promises';

import { Log } from '@src/main/Log';
import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { parseHeader } from '@src/midi/header/header-fns';
import { openFile, readChunk } from '@src/midi/io/io-fns';
import { readEvents } from '@src/midi/track/track-fns';

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
    const targetFile = await openFile(this.sourceFilename, 'w');
    await targetFile.close();
    await sourceFile.close();
  }

  private async fileToObject(file: FileHandle): Promise<object> {
    const headerChunk = await readChunk(file);
    const trackChunks = await this.readTracks(file);
    return {
      header: parseHeader(headerChunk),
      tracks: trackChunks.map((x, i) => this.trackToObject(x, i + 1)),
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

  private trackToObject(chunk: MidiChunk, trackNum: number): object {
    return {
      events: readEvents(chunk),
      number: trackNum,
    };
  }
}

(async () => {
  const command = await CopyFileCommand.parseArgv(console.log, process.argv);
  await command.run();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
