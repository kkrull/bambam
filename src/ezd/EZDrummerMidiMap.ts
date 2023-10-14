import { MidiMap } from '@/src/midi/track/MidiTrack';
import { NoteEvent } from '@/src/midi/track/event-data';

//Re-maps EZDrummer 2 notes to General MIDI notes.
export class EZDrummerMidiMap implements MidiMap {
  static version2Map(): EZDrummerMidiMap {
    return new EZDrummerMidiMap({ [24]: 42 });
  }

  private constructor(
    private readonly _noteNumberMap: { [key: number]: number },
  ) {}

  remap(_event: Readonly<NoteEvent>): NoteEvent {
    throw Error('not implemented');
    // const remappedNote =
    //   this._noteNumberMap[event.noteNumber.value] ?? event.noteNumber;
    // return event.withNoteNumber(remappedNote);
  }
}
