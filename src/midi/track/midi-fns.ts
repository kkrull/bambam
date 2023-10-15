import { FileHandle, open } from 'node:fs/promises';
import { MidiChunk, MidiData } from './MidiChunk';
import { DeltaTime, MidiEvent } from './MidiEvent';
import { MetaEvent, MidiNote, NoteEvent } from './events';

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
    const event = readEvent(trackChunk.data);
    events.push(event);
  }

  return events;
}

export function readEvent(trackData: MidiData): MidiEvent {
  //<MTrk event> = <delta-time> <event>
  //<event> = <MIDI event> | <sysex event> | <meta-event>
  const deltaTime = DeltaTime.ofTicks(trackData.readQuantity());
  const eventType = trackData.readUInt8();
  if (eventType === 0xff) {
    //<meta-event> = FF <type> <length> <bytes>
    const subType = trackData.readUInt8();
    const length = trackData.readQuantity();
    const data = trackData.readData(length);
    return new MetaEvent(deltaTime, eventType, subType, length, data);
  } else if ((eventType & 0x80) === 0x80) {
    //<Note off> = 8n note velocity
    const noteNumber = trackData.readUInt8();
    const velocity = trackData.readUInt8();
    return NoteEvent.off(
      deltaTime,
      eventType & 0x0f,
      MidiNote.numbered(noteNumber),
      velocity,
    );
  } else if ((eventType & 0x90) === 0x90) {
    //<Note on> = 9n note velocity
    const noteNumber = trackData.readUInt8();
    const velocity = trackData.readUInt8();
    return NoteEvent.on(
      deltaTime,
      eventType & 0x0f,
      MidiNote.numbered(noteNumber),
      velocity,
    );
  }

  throw Error(
    `Unknown event type with delta time ${deltaTime.ticks}: ${eventType}`,
  );
}
