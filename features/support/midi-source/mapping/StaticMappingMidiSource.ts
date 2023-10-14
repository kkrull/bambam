import { MidiTrack, MidiTrackBuilder } from '@/src/midi/track/MidiTrack';
import { DeltaTime, MidiNote } from '@/src/midi/track/event-data';
import { MidiSource } from '@/support/midi-source/MidiSource';

//MIDI track with a mapping of the drums available to EZDrummer 2, without I/O.
export class StaticMappingMidiSource implements MidiSource {
  async readTrack(): Promise<MidiTrack> {
    const ezDrummerTrack = new MidiTrackBuilder()
      .withTicksDivision(960)
      .addNoteEvent(DeltaTime.ofTicks(0), {
        //35 B0 Acoustic Bass Drum (GM)
        channel: 10,
        note: MidiNote.numbered(35),
        velocity: 100,
      })
      .addNoteEvent(DeltaTime.ofTicks(960), {
        //C0 24 Hats Open 1: No GM mapping
        channel: 10,
        note: MidiNote.numbered(24),
        velocity: 100,
      })
      .addEndTrackEvent(DeltaTime.ofTicks(3 * 960));

    return ezDrummerTrack.build();
  }
}
