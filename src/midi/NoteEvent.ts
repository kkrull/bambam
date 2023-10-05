import { EventTime } from './EventTime';

//What happens (a note is played), along with when and how it is played
export class NoteEvent {
  public static of({ when, noteNumber, how }: NoteEventParams): NoteEvent {
    return new NoteEvent(when, noteNumber, how);
  }

  private constructor(
    readonly when: EventTime,
    readonly noteNumber: number,
    readonly how: NoteProperties,
  ) {}

  withNoteNumber(otherNoteNumber: number): NoteEvent {
    return new NoteEvent(this.when, otherNoteNumber, this.how);
  }
}

export type NoteEventParams = {
  when: EventTime;
  noteNumber: number;
  how: NoteProperties;
};

export type NoteProperties = {
  velocity: number;
};
