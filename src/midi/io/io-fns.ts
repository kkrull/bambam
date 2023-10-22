import { FileHandle, open } from 'node:fs/promises';

import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { MidiData } from '@src/midi/chunk/MidiData';

export function openFile(filename: string, flag = 'r'): Promise<FileHandle> {
  return open(filename, flag);
}

export async function readChunk(file: FileHandle): Promise<MidiChunk> {
  const chunkType = await MidiData.read(file, 4);
  if (chunkType.isEmpty()) {
    return MidiChunk.empty();
  }

  const chunkLength = await MidiData.read(file, 4);
  const chunkData = await MidiData.read(file, chunkLength.asInt32());
  return new MidiChunk(chunkType.asText(), chunkLength.asInt32(), chunkData);
}

export function toBytes(aString: string): Buffer {
  return Buffer.from(aString, 'latin1');
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
  const { bytesWritten } = await file.write(toBytes(aString));
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
