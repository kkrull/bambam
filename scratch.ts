/* eslint-disable @typescript-eslint/no-var-requires */
import { FileHandle, FileReadResult, open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

(async () => {
  const fh = await open('./features/data/ezd-mapping.mid', 'r');
  const stat = await fh.stat();
  console.log(`File: ${stat.size} bytes`);

  const headerChunk = await readChunk(fh);
  console.log(headerChunk.toObject());

  const firstTrackChunk = await readChunk(fh);
  console.log(firstTrackChunk.toObject());

  const secondTrackChunk = await readChunk(fh);
  console.log(secondTrackChunk.toHex());

  await fh.close();
})();

async function readChunk(fh: FileHandle): Promise<MidiData> {
  const chunkType = await readBytes(fh, 4);
  console.log(`${chunkType.toHex().join(' ')}\t${chunkType.toText()}`);

  const chunkLength = await readBytes(fh, 4);
  console.log(`Chunk length: ${chunkLength.toNumber()} bytes`);

  return readBytes(fh, chunkLength.toNumber());
}

async function readBytes(fh: FileHandle, numBytes: number): Promise<MidiData> {
  const buffer = Buffer.alloc(numBytes);
  const result = await fh.read({ buffer, length: numBytes });
  return MidiData.from(result);
}

class MidiData {
  public static from(result: FileReadResult<Buffer>): MidiData {
    return new MidiData(
      result.buffer.subarray(0, result.bytesRead),
      result.bytesRead,
    );
  }

  constructor(
    private buffer: Buffer,
    public readonly length: number,
  ) {}

  toBytes(): number[] {
    return [...this.buffer];
  }

  toHex(): string[] {
    return this.toBytes().map((x) => Buffer.from([x]).toString('hex'));
  }

  toNumber(): number {
    return this.buffer.readInt32BE(0);
  }

  toText(): string {
    return this.buffer.toString('latin1');
  }

  toObject() {
    return {
      bytes: this.toBytes(),
      hex: this.toHex(),
      number: this.toNumber(),
      text: this.toText(),
    };
  }
}
