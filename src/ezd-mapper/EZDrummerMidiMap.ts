import { MidiNote } from '@src/midi/note/MidiNote';
import { NoteEvent } from '@src/midi/note/NoteEvent';
import { MidiMap } from '@src/midi/track/MidiTrack';

//Re-maps EZDrummer 2 notes to General MIDI notes.
export class EZDrummerMidiMap implements MidiMap {
  static version2Map(): EZDrummerMidiMap {
    return new EZDrummerMidiMap({
      [124]: 46,
      [123]: 42,
      [122]: 42,
      [80]: 47,
      [78]: 45,
      [75]: 43,
      [73]: 41,
      [63]: 42,
      [62]: 42,
      [60]: 46,
      [26]: 46,
      [25]: 42,
      [24]: 42,
      [23]: 46,
      [22]: 42,
      [21]: 42,
      [17]: 46,
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
