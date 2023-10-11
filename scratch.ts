/* eslint-disable @typescript-eslint/no-var-requires */
import { FileHandle, open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

(async () => {
  const fh = await open('./features/data/ezd-mapping.mid', 'r');
  const stat = await fh.stat();
  console.log(`File: ${stat.size} bytes`);

  //TODO KDK: Read the next chunk then parse the file chunk
  const chunkType = await readBytes(fh, 4);
  console.log(`${chunkType.toHex().join(' ')}\t${chunkType.toText()}`);

  const chunkLength = await readBytes(fh, 4);
  console.log(`Chunk length: ${chunkLength.toNumber()} bytes`);

  const chunkData = await readBytes(fh, chunkLength.toNumber());
  console.log(chunkData.toObject());

  await fh.close();
})();

async function readBytes(fh: FileHandle, numBytes: number): Promise<MidiData> {
  const buffer = Buffer.alloc(numBytes);
  await fh.read({ buffer, length: numBytes });
  return new MidiData(buffer);
}

class MidiData {
  constructor(private buffer: Buffer) {}

  toBytes() {
    return [...this.buffer];
  }

  toHex() {
    return this.toBytes().map((x) => Buffer.from([x]).toString('hex'));
  }

  toNumber() {
    return this.buffer.readInt32BE(0);
  }

  toText() {
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
