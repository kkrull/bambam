import path from 'node:path';

import { MidiTrack } from '@/src/midi/track/MidiTrack';
import { MidiSource } from '@/support/midi-source/MidiSource';

//File-based MIDI track with a mapping of the drums available to EZDrummer 2
export class FileMappingMidiSource implements MidiSource {
  private readonly midiPath = path.join(
    __dirname,
    '../../../data/ezd-mapping.mid',
  );

  async readTrack(): Promise<MidiTrack> {
    throw Error('Not implemented');
  }
}
