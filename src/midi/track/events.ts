import { MidiEvent, DeltaTime } from './MidiEvent';

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

  withNote(other: MidiNote): NoteEvent {
    return new NoteEvent(this.deltaTime, this.channel, other, this.velocity);
  }
}
