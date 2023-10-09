import { MidiStream } from '@/src/stream/MidiStream';
import { MidiTrack } from '@/src/midi/track/MidiTrack';
import { MidiSource } from './MidiSource';

//Reads MIDI from a file
export class FileMidiSource implements MidiSource {
  readTrack(): MidiTrack {
    const stream = MidiStream.readFile('../data/ezd-mapping.mid');
    return stream.readTrack();
  }
}
