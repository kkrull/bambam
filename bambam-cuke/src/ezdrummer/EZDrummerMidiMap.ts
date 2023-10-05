import { MidiMap } from '../midi/MidiTrack';
import { NoteEvent } from '../midi/events';

//Produces altered versions of given events, such as transposing or re-mapping
export default class EZDrummerMidiMap implements MidiMap {
  public static version2Map(): EZDrummerMidiMap {
    return new EZDrummerMidiMap({ [24]: 42 });
  }

  private constructor(
    private readonly _noteNumberMap: { [key: number]: number },
  ) {}

  remap(event: Readonly<NoteEvent>): NoteEvent {
    const newNoteNumber = this._noteNumberMap[event.noteNumber];
    return event.withNoteNumber(newNoteNumber);
  }
}
