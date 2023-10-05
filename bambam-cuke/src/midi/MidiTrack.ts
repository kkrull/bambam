class MidiTrack {
  private readonly _noteEvents: NoteEvent[];

  constructor(private readonly bpm: number) {
    this._noteEvents = [];
  }

  addNote(noteNumber: number, when: EventTime, how: EventProperties) {
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
