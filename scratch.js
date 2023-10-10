/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('node:fs/promises');
const { Buffer } = require('node:buffer');

(async () => {
  console.log('Opening file');
  const fh = await fs.open('./features/data/ezd-mapping.mid', 'r');

  const chunkType = await readBytes(fh, 4);
  console.log(`${chunkType.hex().join(' ')}\t${chunkType.text()}`);

  const chunkLength = await readBytes(fh, 4);
  console.log(`Chunk length: ${chunkLength.number()} bytes`);

  const chunkData = await readBytes(fh, chunkLength.number());
  console.log(chunkData);
})();

async function readBytes(fh, numBytes) {
  const buffer = Buffer.alloc(numBytes);
  await fh.read(buffer, { length: numBytes });

  return {
    data: [...buffer],
    hex: () => [...buffer].map((x) => Buffer.from([x]).toString('hex')),
    number: () => buffer.readInt32BE(0),
    text: () => buffer.toString('latin1'),
  };
}
