import { MidiSource } from './MidiSource';
import { StaticMidiSource } from './StaticMidiSource';

//Provides access to whichever MIDI source is active right now
export class MidiSourceProvider {
  private static _instance: MidiSource;

  public static getInstance(): MidiSource {
    if (!MidiSourceProvider._instance) {
      MidiSourceProvider._instance = new StaticMidiSource();
    }

    return MidiSourceProvider._instance;
  }

  public static setInstance(source: MidiSource) {
    this._instance = source;
  }

  private constructor() {}
}
