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

export async function writeUInt8(
  file: FileHandle,
  byte: number,
): Promise<number> {
  const buffer = Buffer.alloc(1);
  buffer.writeInt8(byte);
  const { bytesWritten } = await file.write(buffer);
  return bytesWritten;
}
