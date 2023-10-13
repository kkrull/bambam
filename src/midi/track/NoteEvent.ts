//A timed event related to a note, along with how it is played.
export class NoteEvent {
  static of({ when, noteNumber, how }: NoteEventParams): NoteEvent {
    return new NoteEvent(when, noteNumber, how);
  }

  private constructor(
    readonly when: DeltaTime,
    readonly noteNumber: MidiNote,
    readonly how: MidiNoteProperties,
  ) {}

  withNoteNumber(otherNoteNumber: MidiNote): NoteEvent {
    return new NoteEvent(this.when, otherNoteNumber, this.how);
  }
}

export type NoteEventParams = {
  when: DeltaTime;
  noteNumber: MidiNote;
  how: MidiNoteProperties;
};

//Time elapsed between an event and the one just before it.
export class DeltaTime {
  static of(ticks: number): DeltaTime {
    return new DeltaTime(ticks);
  }

  private constructor(readonly ticks: number) {}
}

//A note that can be played on a MIDI device.
class MidiNote {
  static fromNumber(value: number): MidiNote {
    return new MidiNote(value);
  }

  private constructor(readonly value: number) {}
}

export type MidiNoteProperties = {
  velocity: number;
};
