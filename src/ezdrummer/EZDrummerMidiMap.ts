import { MidiMap } from '@/src/midi/track/MidiTrack';
import { NoteEvent } from '@/src/midi/track/NoteEvent';

//Produces altered versions of given events, such as transposing or re-mapping
export class EZDrummerMidiMap implements MidiMap {
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
