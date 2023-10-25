import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { readEvent } from '@src/midi/chunk/midi-data-fns';
import { MidiEvent } from '@src/midi/event/MidiEvent';
import { HeaderChunk } from '@src/midi/header/HeaderChunk';
import { parseDivision } from '@src/midi/number-fns';

export function readEvents(trackChunk: MidiChunk): MidiEvent[] {
  //<Track Chunk> = <chunk type> <length> <MTrk event>+
  const events: MidiEvent[] = [];
  while (!trackChunk.data.isDoneReading()) {
    const event = readEvent(trackChunk.data);
    events.push(event);
  }

  return events;
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
