import { FileHandle, open } from 'node:fs/promises';
import { MidiChunk, MidiData } from './MidiChunk';

/* Header chunks */

export function parseHeader(_header: MidiChunk): HeaderChunk {
  return {
    format: 1,
    numTracks: 2,
    division: { ticksPerQuarterNote: 960 },
  };
}

export type HeaderChunk = {
  format: number;
  numTracks: number;
  division: { ticksPerQuarterNote: number };
};

/* I/O */

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
