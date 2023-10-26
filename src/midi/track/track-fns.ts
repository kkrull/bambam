import { MidiChunk } from '../chunk/MidiChunk';
import { MidiData } from '../chunk/MidiData';
import { MidiTrack } from './MidiTrack';

export function toChunk(track: MidiTrack): MidiChunk {
  const eventData = eventBytes(track);
  return new MidiChunk('MTrk', eventData.length, MidiData.fromBytes(eventData));
}

export function eventBytes(_track: MidiTrack): number[] {
  //TODO KDK: work here - convert events to a byte array first, then figure out how to write a chunk
  throw Error('eventBytes: not implemented');
}
