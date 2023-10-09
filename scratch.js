/* eslint-disable @typescript-eslint/no-var-requires */
const fsp = require('node:fs/promises');
const { Buffer } = require('node:buffer');

(async () => {
  console.log('Opening file');
  const fh = await fsp.open('./features/data/ezd-mapping.mid', 'r');

  const buffer = Buffer.alloc(4);
  const result = await fh.read(buffer, { length: 4 });

  const bufferAsHex = [...buffer].map((x) => Buffer.from([x]).toString('hex'));
  const chunkType = result.buffer.toString('latin1');
  console.log(`${bufferAsHex.join(' ')}\t${chunkType}`);
})();
