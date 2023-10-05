//A stream of timed, musical events for the same instrument.
class MidiTrack {
  private readonly _noteEvents: NoteEvent[];

  constructor(private readonly bpm: number) {
    this._noteEvents = [];
  }

  addNote(when: EventTime, noteNumber: number, how: EventProperties) {
    this._noteEvents.push({ noteNumber, time: when, velocity: how.velocity });
  }

  beatsPerMinute(): number {
    return this.bpm;
  }

  toGeneralMidi(): MidiTrack {
    return new MidiTrack(this.bpm);
  }
}

export default MidiTrack;

type EventTime = {
  measure: number;
  beat: number;
  tick: number;
};

type EventProperties = {
  velocity: number;
};

type NoteEvent = {
  noteNumber: number;
  time: EventTime;
  velocity: number;
};
