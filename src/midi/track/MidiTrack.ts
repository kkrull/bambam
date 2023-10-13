import { EventTime, EventTimeParams } from '@/src/midi/EventTime';
import { TickDivision } from '@/src/midi/division/TickDivision';
import { NoteEvent, NoteEventParams, NoteProperties } from './NoteEvent';

//A stream of timed, musical events for the same instrument.
export class MidiTrack {
  static withTicksDivision(ticksPerQuarterNote: number): MidiTrack {
    return new MidiTrack(new TickDivision(ticksPerQuarterNote));
  }

  endTime?: EventTime;
  private readonly _noteEvents: NoteEvent[];

  private constructor(readonly division: TickDivision) {
    this._noteEvents = [];
  }

  addNote(when: EventTimeParams, noteNumber: number, how: NoteProperties) {
    const eventParams: NoteEventParams = {
      when: EventTime.of(when),
      noteNumber,
      how,
    };

    this._noteEvents.push(NoteEvent.of(eventParams));
  }

  endTrack(when: EventTimeParams) {
    this.endTime = EventTime.of(when);
  }

  noteNumbersAt(when: EventTimeParams): number[] {
    return this._noteEvents
      .filter((event) => event.when.isSameAs(when))
      .map((event) => event.noteNumber);
  }

  noteTimes(): EventTime[] {
    return this._noteEvents.map((event) => event.when);
  }

  remap(mapper: MidiMap): MidiTrack {
    const remappedTrack = new MidiTrack(this.division);
    remappedTrack.endTime = this.endTime;

    this._noteEvents.forEach((event) => {
      const remappedEvent = mapper.remap(event);
      remappedTrack.addEvent(remappedEvent);
    });

    return remappedTrack;
  }

  private addEvent(event: NoteEvent): void {
    this._noteEvents.push(event);
  }
}

//Maps MIDI note events one at a time from one note or articulation to another
export interface MidiMap {
  remap(event: Readonly<NoteEvent>): NoteEvent;
}
