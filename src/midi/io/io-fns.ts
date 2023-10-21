import { FileHandle, open } from 'node:fs/promises';

import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { MidiData } from '@src/midi/chunk/MidiData';

export function openFile(filename: string): Promise<FileHandle> {
  return open(filename, 'r');
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
