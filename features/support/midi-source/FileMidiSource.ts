import { MidiTrack } from '@/src/midi/track/MidiTrack';
import { MidiSource } from './MidiSource';

export class FileMidiSource implements MidiSource {
  readTrack(): MidiTrack {
    throw new Error('Method not implemented.');
  }
}
