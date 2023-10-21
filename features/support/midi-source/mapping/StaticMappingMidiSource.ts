import { DeltaTime } from '@src/midi/event/DeltaTime';
import { MidiNote } from '@src/midi/note/MidiNote';
import { MidiTrack } from '@src/midi/track/MidiTrack';
import { MidiTrackBuilder } from '@src/midi/track/MidiTrackBuilder';
import { MidiSource } from '@support/midi-source/MidiSource';

//MIDI track with a mapping of the drums available to EZDrummer 2, without I/O.
export class StaticMappingMidiSource implements MidiSource {
  async readTrack(): Promise<MidiTrack> {
    const ezDrummerTrack = new MidiTrackBuilder()
      .withDivisionInTicks(960)
      .addNoteOnEvent(DeltaTime.ofTicks(0), {
        //35 B0 Acoustic Bass Drum (GM)
        channel: 10,
        note: MidiNote.numbered(35),
        velocity: 96,
      })
      .addNoteOnEvent(DeltaTime.ofTicks(960), {
        //35 B0 Acoustic Bass Drum (GM) "off"
        channel: 10,
        note: MidiNote.numbered(35),
        velocity: 0,
      })
      .addNoteOnEvent(DeltaTime.ofTicks(0), {
        //C0 24 Hats Open 1: No GM mapping
        channel: 10,
        note: MidiNote.numbered(24),
        velocity: 96,
      })
      .addNoteOnEvent(DeltaTime.ofTicks(960), {
        //C0 24 Hats Open 1: No GM mapping "off"
        channel: 10,
        note: MidiNote.numbered(24),
        velocity: 0,
      })
      .addEndTrackEvent(DeltaTime.ofTicks(3 * 960));

    return ezDrummerTrack.build();
  }
}
