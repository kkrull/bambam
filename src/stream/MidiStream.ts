import { MidiTrack } from '@/src/midi/track/MidiTrack';

//Reads and parses MIDI data from a byte stream
export class MidiStream {
  public static readFile(_filename: string): MidiStream {
    throw new Error('Method not implemented.');
  }

  readTrack(): MidiTrack {
    throw new Error('Method not implemented.');
  }
}
