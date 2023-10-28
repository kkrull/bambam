import { MidiNote } from '@src/midi/note/MidiNote';
import { NoteEvent } from '@src/midi/note/NoteEvent';
import { MidiMap } from '@src/midi/track/MidiTrack';

//Re-maps EZDrummer 2 notes to General MIDI notes.
//TODO KDK: Make a separate mapping/program to put all the notes on one channel (MEO has notes on channels 0 and 9)
export class EZDrummerMidiMap implements MidiMap {
  static version2Map(): EZDrummerMidiMap {
    return new EZDrummerMidiMap({
      [124]: 46, //124 Hats Open 5          46 Bb1 Open Hi-Hat
      [123]: 42, //123 Hats Open 1          42 F#1 Closed Hi Hat
      [122]: 42, //122 Hats Closed Edge     42 F#1 Closed Hi Hat
      [80]: 47, //  80 Racktom 2 Rimshot    47 B1 Low-Mid Tom
      [78]: 45, //  78 Racktom 3 Rimshot    45 A1 Low Tom
      [75]: 43, //  75 Floortom 1 Rimshot   43 G1 High Floor Tom
      [73]: 41, //  73 Floortom 2 Rimshot   41 F1 Low Floor Tom
      [63]: 42, //  63 Hats Tight Tip       42 F#1 Closed Hi Hat
      [62]: 42, //  62 Hats Tight Edge      42 F#1 Closed Hi Hat
      [60]: 46, //  60 Hats Open 4          46 Bb1 Open Hi-Hat
      [58]: 57, //  58 Cymbal 3 Mute Hit    57 A2 Crash Cymbal 2
      [26]: 46, //  26 Hats Open 3          46 Bb1 Open Hi-Hat
      [25]: 42, //  25 Hats Open 2          42 F#1 Closed Hi Hat
      [24]: 42, //  24 Hats Open 1          42 F#1 Closed Hi Hat
      [23]: 46, //  23 Hats Open Pedal      46 Bb1 Open Hi-Hat
      [22]: 42, //  22 Hats Closed Edge     42 F#1 Closed Hi Hat
      [21]: 42, //  21 Hats Closed Pedal    42 F#1 Closed Hi Hat
      [17]: 46, //  17 Hats Open 5          46 Bb1 Open Hi-Hat
    });
  }

  private constructor(
    private readonly _noteNumberMap: { [key: number]: number },
  ) {}

  remap(event: NoteEvent): NoteEvent {
    const remappedNote =
      this._noteNumberMap[event.note.noteNumber] ?? event.note.noteNumber;
    return event.withNote(MidiNote.numbered(remappedNote));
  }
}
