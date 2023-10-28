import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { toVariableLengthQuantity } from '@src/midi/number-fns';
import { FileHandle, open } from 'node:fs/promises';

export function openFile(filename: string, flag = 'r'): Promise<FileHandle> {
  return open(filename, flag);
}

export async function readChunks(file: FileHandle): Promise<MidiChunk[]> {
  const trackChunks = [];
  let chunk = await MidiChunk.read(file);
  while (!chunk.isEmpty()) {
    trackChunks.push(chunk);
    chunk = await MidiChunk.read(file);
  }

  return trackChunks;
}

export async function writeBytes(
  file: FileHandle,
  bytes: number[],
): Promise<number> {
  const { bytesWritten } = await file.write(Buffer.from(bytes));
  return bytesWritten;
}

export async function writeString(
  file: FileHandle,
  aString: string,
): Promise<number> {
  const buffer = Buffer.from(aString, 'latin1');
  const { bytesWritten } = await file.write(buffer);
  return bytesWritten;
}

export async function writeUInt8(
  file: FileHandle,
  byte: number,
): Promise<number> {
  const buffer = Buffer.alloc(1);
  buffer.writeUInt8(byte);
  const { bytesWritten } = await file.write(buffer);
  return bytesWritten;
}

export async function writeUInt32(
  file: FileHandle,
  aNumber: number,
): Promise<number> {
  const buffer = Buffer.alloc(4);
  buffer.writeInt32BE(aNumber);
  const { bytesWritten } = await file.write(buffer);
  return bytesWritten;
}

export async function writeVariableLengthQuantity(
  file: FileHandle,
  quantity: number,
): Promise<number> {
  const buffer = Buffer.from(toVariableLengthQuantity(quantity));
  const writeQuantity = await file.write(buffer);
  return writeQuantity.bytesWritten;
}
