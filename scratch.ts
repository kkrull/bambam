/* eslint-disable @typescript-eslint/no-var-requires */
import { FileHandle, FileReadResult, open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

(async () => {
  const fh = await open('./features/data/ezd-mapping.mid', 'r');
  const stat = await fh.stat();
  console.log(`File: ${stat.size} bytes`);

  //TODO KDK: Make a copy of this file and start parsing the header chunk
  const headerChunk = await readChunk(fh);
  console.log(`${headerChunk.typeName}: ${headerChunk.length} bytes`);
  headerChunk.data
    .toHexRows(16)
    .forEach((hexRow, i) => console.log(`${i * 16}:\t${hexRow.join(' ')}`));

  let chunk = await readChunk(fh);
  while (chunk.length !== 0) {
    console.log();
    console.log(`${chunk.typeName}: ${chunk.length} bytes`);
    chunk.data
      .toHexRows(16)
      .forEach((hexRow, i) => console.log(`${i * 16}:\t${hexRow.join(' ')}`));

    chunk = await readChunk(fh);
  }

  console.log('End of file');
  await fh.close();
})();

async function readChunk(fh: FileHandle): Promise<MidiChunk> {
  const chunkType = await readBytes(fh, 4);
  if (chunkType.length === 0) {
    return new MidiChunk('', 0, new MidiData(Buffer.alloc(0), 0));
  }

  const chunkLength = await readBytes(fh, 4);
  const chunkData = await readBytes(fh, chunkLength.toNumber());
  return new MidiChunk(chunkType.toText(), chunkLength.toNumber(), chunkData);
}

async function readBytes(fh: FileHandle, numBytes: number): Promise<MidiData> {
  const buffer = Buffer.alloc(numBytes);
  const result = await fh.read({ buffer, length: numBytes });
  return MidiData.from(result);
}

class MidiChunk {
  constructor(
    public readonly typeName: string,
    public readonly length: number,
    public readonly data: MidiData,
  ) {}
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

  toHexRows(chunkSize: number): string[][] {
    const flatArray = this.toHex();

    const chunks: string[][] = [];
    for (let i = 0; i < flatArray.length; i = i + chunkSize) {
      const chunk = flatArray.slice(i, i + chunkSize);
      chunks.push(chunk);
    }

    return chunks;
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
