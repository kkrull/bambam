import { toVariableLengthQuantity } from '@src/midi/number-fns';

export function ofString(aString: string): Buffer {
  return Buffer.from(aString, 'latin1');
}

export function ofUInt8(byte: number): Buffer {
  const buffer = Buffer.alloc(1);
  buffer.writeUInt8(byte);
  return buffer;
}

export function ofUInt32(aNumber: number): Buffer {
  const buffer = Buffer.alloc(4);
  buffer.writeInt32BE(aNumber);
  return buffer;
}

export function ofVariableLengthQuantity(quantity: number): Buffer {
  return Buffer.from(toVariableLengthQuantity(quantity));
}
