import { MidiMap } from '@/src/midi/MidiTrack';
import { NoteEvent } from '@/src/midi/NoteEvent';

//Produces altered versions of given events, such as transposing or re-mapping
export default class EZDrummerMidiMap implements MidiMap {
  public static version2Map(): EZDrummerMidiMap {
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
