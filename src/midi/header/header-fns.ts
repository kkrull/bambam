import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { Division, HeaderChunk } from '@src/midi/header/HeaderChunk';

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
