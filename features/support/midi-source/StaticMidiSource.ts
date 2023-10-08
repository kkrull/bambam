import { MidiTrack } from '@/src/midi/track/MidiTrack';
import { MidiSource } from './MidiSource';

//MIDI track consisting only of the data model, without reading from I/O
export class StaticMidiSource implements MidiSource {
  readTrack(): MidiTrack {
    const ezDrummerTrack = MidiTrack.withTicksDivision(960);
    ezDrummerTrack.setTempo(120, { measure: 1, beat: 1, tick: 0 });
    ezDrummerTrack.setTimeSignature(
      { numDivisions: 4, divisionNote: 4 },
      { measure: 1, beat: 1, tick: 0 },
    );

    //35 B0 Acoustic Bass Drum (GM)
    ezDrummerTrack.addNote({ measure: 1, beat: 1, tick: 0 }, 35, {
      velocity: 100,
    });

    //C0 24 Hats Open 1: No GM mapping
    ezDrummerTrack.addNote({ measure: 1, beat: 2, tick: 0 }, 24, {
      velocity: 100,
    });

    ezDrummerTrack.endTrack({ measure: 2, beat: 1, tick: 0 });
    return ezDrummerTrack;
  }
}
