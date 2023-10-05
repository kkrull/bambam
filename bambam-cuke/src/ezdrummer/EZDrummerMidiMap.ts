import { MidiMap } from '../midi/MidiTrack';
import { NoteEvent } from '../midi/events';

export default class EZDrummerMidiMap implements MidiMap {
  public static version2Map(): EZDrummerMidiMap {
    return new EZDrummerMidiMap();
  }

  remap(event: NoteEvent): NoteEvent {
    throw new Error('Method not implemented.');
  }
}
