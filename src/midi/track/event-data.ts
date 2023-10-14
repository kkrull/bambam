//Any MIDI event, which is always preceded by a delta time from the prior event.
export abstract class MidiEvent {
  constructor(readonly deltaTime: DeltaTime) {}
}

//Time elapsed between an event and the one just before it.
export class DeltaTime {
  static ofTicks(ticks: number): DeltaTime {
    return new DeltaTime(ticks);
  }

  private constructor(readonly ticks: number) {}

  plus(other: DeltaTime): DeltaTime {
    return new DeltaTime(this.ticks + other.ticks);
  }
}

//An event required at the end of a track chunk to show when it ends.
export class EndTrackEvent extends MidiEvent {
  constructor(readonly deltaTime: DeltaTime) {
    super(deltaTime);
  }
}

//A note that can be played on a MIDI device.
export class MidiNote {
  static numbered(value: number): MidiNote {
    return new MidiNote(value);
  }

  private constructor(readonly noteNumber: number) {}
}

//A timed event related to a note, along with how it is played.
export class NoteEvent extends MidiEvent {
  constructor(
    readonly deltaTime: DeltaTime,
    readonly channel: number,
    readonly note: MidiNote,
    readonly velocity: number,
  ) {
    super(deltaTime);
  }

  withNote(_otherNote: MidiNote): NoteEvent {
    throw Error('not implemented');
  }
}
