import { MidiSource } from './MidiSource';
import { StaticMappingMidiSource } from './mapping/StaticMappingMidiSource';

//Provides access to whichever MIDI source is active right now
export class MidiSourceProvider {
  private static _instance: MidiSource | null;

  public static clearInstance() {
    MidiSourceProvider._instance = null;
  }

  public static getInstance(): MidiSource {
    if (!MidiSourceProvider._instance) {
      MidiSourceProvider._instance = new StaticMappingMidiSource();
    }

    return MidiSourceProvider._instance;
  }

  public static setInstance(source: MidiSource) {
    MidiSourceProvider._instance = source;
  }

  private constructor() {}
}
