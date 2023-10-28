import { Division } from '@src/midi/header/HeaderChunk';

export function parseDivision(division: number): Division {
  const divisionType = (division & 0x8000) >> 15;
  if (divisionType === 0) {
    return { ticksPerQuarterNote: division & 0x7fff };
  } else {
    //Sub-divisions of a second, ala SMPTE
    throw Error(`Unsupported division type ${divisionType} in: ${division}`);
  }
}

export function toVariableLengthQuantity(quantity: number): Buffer {
  let bitsToWrite = quantity;
  const bytes = [];

  bytes.unshift(bitsToWrite & 0x7f);
  bitsToWrite = bitsToWrite >> 7;
  while (bitsToWrite > 0) {
    const quantityBits = bitsToWrite & 0x7f;
    const byte = quantityBits | 0x80;
    bytes.unshift(byte);
    bitsToWrite = bitsToWrite >> 7;
  }

  return Buffer.from(bytes);
}
