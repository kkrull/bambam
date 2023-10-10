/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('node:fs/promises');
const { Buffer } = require('node:buffer');

(async () => {
  const fh = await fs.open('./features/data/ezd-mapping.mid', 'r');

  const chunkType = await readBytes(fh, 4);
  console.log(`${chunkType.toHex().join(' ')}\t${chunkType.toText()}`);

  const chunkLength = await readBytes(fh, 4);
  console.log(`Chunk length: ${chunkLength.toNumber()} bytes`);

  const chunkData = await readBytes(fh, chunkLength.toNumber());
  console.log(chunkData.toObject());
})();

async function readBytes(fh, numBytes) {
  const buffer = Buffer.alloc(numBytes);
  await fh.read(buffer, { length: numBytes });
  return new MidiData(buffer);
}

class MidiData {
  constructor(buffer) {
    this.buffer = buffer;
  }

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
