import { MidiMap } from '@/src/midi/track/MidiTrack';
import { NoteEvent } from '@/src/midi/track/NoteEvent';

//Re-maps EZDrummer 2 notes to General MIDI notes.
export class EZDrummerMidiMap implements MidiMap {
  static version2Map(): EZDrummerMidiMap {
    return new EZDrummerMidiMap({ [24]: 42 });
  }

  private constructor(
    private readonly _noteNumberMap: { [key: number]: number },
  ) {}

  remap(event: Readonly<NoteEvent>): NoteEvent {
    const remappedNote =
      this._noteNumberMap[event.noteNumber] ?? event.noteNumber;
    return event.withNoteNumber(remappedNote);
  }
}
