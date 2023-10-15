import { MidiEvent, DeltaTime } from './MidiEvent';

//An event required at the end of a track chunk to show when it ends.
export class EndTrackEvent extends MidiEvent {
  constructor(readonly deltaTime: DeltaTime) {
    super(deltaTime, 0xff);
  }
}

export class MetaEvent extends MidiEvent {
  constructor(
    readonly deltaTime: DeltaTime,
    readonly eventType: number,
    readonly subType: number,
    readonly length: number,
    readonly data: number[],
  ) {
    super(deltaTime, eventType);
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
  static off(
    deltaTime: DeltaTime,
    channel: number,
    note: MidiNote,
    velocity: number,
  ): NoteEvent {
    return new NoteEvent(
      deltaTime,
      (0x8 << 4) + channel,
      channel,
      note,
      velocity,
    );
  }

  static on(
    deltaTime: DeltaTime,
    channel: number,
    note: MidiNote,
    velocity: number,
  ): NoteEvent {
    return new NoteEvent(
      deltaTime,
      (0x9 << 4) + channel,
      channel,
      note,
      velocity,
    );
  }

  private constructor(
    readonly deltaTime: DeltaTime,
    readonly eventType: number,
    readonly channel: number,
    readonly note: MidiNote,
    readonly velocity: number,
  ) {
    super(deltaTime, eventType);
  }

  withNote(other: MidiNote): NoteEvent {
    return new NoteEvent(
      this.deltaTime,
      this.eventType,
      this.channel,
      other,
      this.velocity,
    );
  }
}
