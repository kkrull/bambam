import { MidiTrack, MidiTrackBuilder } from '@/src/midi/track/MidiTrack';
import { MidiSource } from '@/support/midi-source/MidiSource';

//MIDI track with a mapping of the drums available to EZDrummer 2, without I/O
export class StaticMappingMidiSource implements MidiSource {
  async readTrack(): Promise<MidiTrack> {
    const ezDrummerTrack = new MidiTrackBuilder().withTicksDivision(960);

    //35 B0 Acoustic Bass Drum (GM)
    ezDrummerTrack.addNoteEvent(0, 35, { velocity: 100 });

    //C0 24 Hats Open 1: No GM mapping
    ezDrummerTrack.addNoteEvent(960, 24, { velocity: 100 });

    ezDrummerTrack.addEndTrackEvent(3 * 960);
    return ezDrummerTrack.build();
  }
}
