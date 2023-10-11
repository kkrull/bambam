import { MidiTrack } from '@/src/midi/track/MidiTrack';

//Provides MIDI
export interface MidiSource {
  readTrack(): MidiTrack;
}
