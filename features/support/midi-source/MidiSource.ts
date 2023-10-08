import { MidiTrack } from '@/src/midi/track/MidiTrack';
import { StaticMidiSource } from './StaticMidiSource';

//Provides MIDI
export interface MidiSource {
  readTrack(): MidiTrack;
}

//Provides access to whichever MIDI source is active right now
export class MidiSourceProvider {
  private static _instance: MidiSourceProvider;

  static getInstance(): MidiSourceProvider {
    if (!MidiSourceProvider._instance) {
      MidiSourceProvider._instance = new MidiSourceProvider();
    }

    return MidiSourceProvider._instance;
  }

  private _source?: MidiSource;
  private constructor() {}

  getSource(): MidiSource {
    if (!this._source) {
      this._source = new StaticMidiSource();
    }

    return this._source;
  }

  setSource(source: MidiSource) {
    this._source = source;
  }
}
