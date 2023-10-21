import { DeltaTime } from '@src/midi/event/DeltaTime';
import { NoteEvent } from '@src/midi/note/NoteEvent';

//A note event, in time relative to the start of the track.
export class NoteEventTime {
  static at(accumulatedDelta: DeltaTime, event: NoteEvent): NoteEventTime {
    return new NoteEventTime(accumulatedDelta.ticks, event);
  }

  private constructor(
    readonly ticksFromStart: number,
    readonly event: NoteEvent,
  ) {}
}
