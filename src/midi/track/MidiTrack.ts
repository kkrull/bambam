import { MidiEvent } from '../event/MidiEvent';
import { DeltaTime } from '../event/DeltaTime';
import { EndTrackEvent } from './EndTrackEvent';
import { NoteEvent } from '../note/NoteEvent';
import { NoteEventTime } from './NoteEventTime';
import { TickDivision } from './TickDivision';

//A stream of timed, musical events for 1 or more instruments.
export class MidiTrack {
  constructor(
    readonly division: TickDivision,
    readonly endTrackEvent: EndTrackEvent,
    readonly events: MidiEvent[],
  ) {}

  allEvents(): MidiEvent[] {
    return [...this.events, this.endTrackEvent];
  }

  endTime(): number {
    const delta = this.events.reduce((acc, x) => acc + x.deltaTime.ticks, 0);
    return delta + this.endTrackEvent.deltaTime.ticks;
  }

  nonNoteEvents(): MidiEvent[] {
    return this.allEvents().filter((x) => x instanceof NoteEvent === false);
  }

  noteEvents(): NoteEvent[] {
    return this.events
      .filter((x) => x instanceof NoteEvent)
      .map((x) => x as NoteEvent);
  }

  noteEventTimes(): NoteEventTime[] {
    let accumulatedTime = DeltaTime.ofTicks(0);
    const noteEventTimes: NoteEventTime[] = [];
    for (const event of this.allEvents()) {
      accumulatedTime = accumulatedTime.plus(event.deltaTime);
      if (event instanceof NoteEvent) {
        noteEventTimes.push(NoteEventTime.at(accumulatedTime, event));
      }
    }

    return noteEventTimes;
  }

  remap(mapper: MidiMap): MidiTrack {
    const mappedEvents: MidiEvent[] = this.events.map((x) => {
      if (x instanceof NoteEvent === false) {
        return x;
      }

      return mapper.remap(x as NoteEvent);
    });

    return new MidiTrack(this.division, this.endTrackEvent, mappedEvents);
  }
}

//Transforms MIDI events one at a time, such as from one note to another.
export interface MidiMap {
  remap(event: Readonly<NoteEvent>): NoteEvent;
}
