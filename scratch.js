/* eslint-disable @typescript-eslint/no-var-requires */
const fsp = require('node:fs/promises');
const { Buffer } = require('node:buffer');

(async () => {
  console.log('Opening file');
  const fh = await fsp.open('./features/data/ezd-mapping.mid', 'r');

  const chunkType = await readBytes(fh, 4);
  console.log(`${chunkType.hex.join(' ')}\t${chunkType.text}`);

  const chunkLength = await readBytes(fh, 4);
  console.log(`Chunk length: ${chunkLength.number} bytes`);
})();

async function readBytes(fh, numBytes) {
  const buffer = Buffer.alloc(numBytes);
  await fh.read(buffer, { length: numBytes });

  return {
    data: [...buffer],
    hex: [...buffer].map((x) => Buffer.from([x]).toString('hex')),
    number: buffer.readInt32BE(0),
    text: buffer.toString('latin1'),
  };
}
