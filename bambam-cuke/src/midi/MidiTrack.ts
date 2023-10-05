import { EventTime, NoteEvent, NoteProperties } from './events';

//A stream of timed, musical events for the same instrument.
export default class MidiTrack {
  private readonly _noteEvents: NoteEvent[];

  constructor(private readonly bpm: number) {
    this._noteEvents = [];
  }

  addNote(when: EventTime, noteNumber: number, how: NoteProperties) {
    this._noteEvents.push({
      when,
      noteNumber,
      how,
    });
  }

  beatsPerMinute(): number {
    return this.bpm;
  }

  noteTimes(): EventTime[] {
    return this._noteEvents.map((event) => event.when);
  }

  remap(mapper: MidiMap): MidiTrack {
    const remapped = new MidiTrack(this.bpm);
    remapped.addEvents(this._noteEvents);
    return remapped;
  }

  private addEvents(events: NoteEvent[]): void {
    this._noteEvents.push(...events);
  }
}

export interface MidiMap {
  remap(event: Readonly<NoteEvent>): NoteEvent;
}
