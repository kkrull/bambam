import { MidiMap } from '@/src/midi/track/MidiTrack';
import { NoteEvent } from '../midi/track/NoteEvent';
import { MidiNote } from '../midi/track/MidiNote';

//Re-maps EZDrummer 2 notes to General MIDI notes.
export class EZDrummerMidiMap implements MidiMap {
  static version2Map(): EZDrummerMidiMap {
    return new EZDrummerMidiMap({ [24]: 42 });
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
