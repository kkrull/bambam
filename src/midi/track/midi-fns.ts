import { FileHandle, open } from 'node:fs/promises';
import { MidiChunk, MidiData } from './MidiChunk';
import { MidiEvent } from './MidiEvent';

/* Header chunks */

function parseDivision(division: number): Division {
  const divisionType = (division & 0x8000) >> 15;
  if (divisionType === 0) {
    return { ticksPerQuarterNote: division & 0x7fff };
  } else {
    //Sub-divisions of a second, ala SMPTE
    throw Error(`Unsupported division type ${divisionType} in: ${division}`);
  }
}

export function parseHeader(header: MidiChunk): HeaderChunk {
  if (header.length !== 6) {
    throw Error(`Expected header to have 6 bytes, but has: ${header.length}`);
  }

  return {
    format: header.data.slice(0, 2).asInt16(),
    numTracks: header.data.slice(2, 4).asInt16(),
    division: {
      ...parseDivision(header.data.slice(4, 6).asInt16()),
    },
  };
}

export type Division = {
  ticksPerQuarterNote: number;
};

export type HeaderChunk = {
  format: number;
  numTracks: number;
  division: Division;
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

/* Track chunks */

export function readEvents(trackChunk: MidiChunk): MidiEvent[] {
  const events: MidiEvent[] = [];
  while (!trackChunk.data.isDone()) {
    trackChunk.data.readUInt8();
  }

  return events;
  // _trackChunk.data.readEvent();
}

// export function readEvent(trackChunk: MidiData): MidiEvent {}
