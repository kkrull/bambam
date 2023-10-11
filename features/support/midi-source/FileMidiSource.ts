import { MidiTrack } from '@/src/midi/track/MidiTrack';
import { MidiSource } from './MidiSource';

//Reads MIDI from a file
export class FileMidiSource implements MidiSource {
  readTrack(): MidiTrack {
    throw new Error('Method not implemented.');
  }

  readTrackPrototype(): MidiTrack {
    const stream = MidiStream.readFile('../../data/ezd-mapping.mid');
    return stream.readTrack();
  }
}

//Reads and parses MIDI data from a byte stream
class MidiStream {
  public static readFile(_filename: string): MidiStream {
    throw new Error('Method not implemented.');
  }

  readTrack(): MidiTrack {
    throw new Error('Method not implemented.');
  }
}
