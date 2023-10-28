import { MidiData } from '@src/midi//chunk/MidiData';
import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { MidiTrack } from '@src/midi/track/MidiTrack';

export function eventBytes(track: MidiTrack): Buffer {
  const trackBytes: number[] = [];
  track.allEvents().forEach((x) => {
    const eventBytes = x.toBytes();
    trackBytes.push(...eventBytes);
  });

  return Buffer.from(trackBytes);
}

export function toChunk(track: MidiTrack): MidiChunk {
  const eventData = eventBytes(track);
  return new MidiChunk('MTrk', eventData.length, MidiData.ofBytes(eventData));
}
