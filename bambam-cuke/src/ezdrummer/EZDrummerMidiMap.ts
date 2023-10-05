import { MidiMap } from '../midi/MidiTrack';
import { NoteEvent } from '../midi/events';

//Produces altered versions of given events, such as transposing or re-mapping
export default class EZDrummerMidiMap implements MidiMap {
  public static version2Map(): EZDrummerMidiMap {
    return new EZDrummerMidiMap();
  }

  remap(event: Readonly<NoteEvent>): NoteEvent {
    //TODO KDK: Implement
    // return event.withNoteNumber(42);
    return {
      when: event.when,
      noteNumber: 42,
      how: event.how,
    };
  }
}
