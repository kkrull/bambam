import { NoteEvent, NoteEventParams, NoteProperties } from './NoteEvent';
import { EventTime, EventTimeParams } from './EventTime';

//A stream of timed, musical events for the same instrument.
export default class MidiTrack {
  public static withTicksDivision(ticksPerQuarterNote: number): MidiTrack {
    return new MidiTrack(new TickDivision(ticksPerQuarterNote));
  }

  endTime?: EventTime;
  private readonly _noteEvents: NoteEvent[];
  private _tempoMap: TempoMap;
  private _timeSignatureMap: TimeSignatureMap;

  private constructor(readonly division: TickDivision) {
    this._noteEvents = [];
    this._tempoMap = [];
    this._timeSignatureMap = [];
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
    remappedTrack._tempoMap = this.tempoMap();
    remappedTrack._timeSignatureMap = this.timeSignatureMap();

    this._noteEvents.forEach((event) => {
      const remappedEvent = mapper.remap(event);
      remappedTrack.addEvent(remappedEvent);
    });

    return remappedTrack;
  }

  setTempo(bpm: number, when: EventTimeParams) {
    const event = new SetTempoEvent(bpm, EventTime.of(when));
    this._tempoMap.push(event);
  }

  setTimeSignature(signature: TimeSignatureParams, when: EventTimeParams) {
    const event = new SetTimeSignatureEvent(
      TimeSignature.from(signature),
      EventTime.of(when),
    );
    this._timeSignatureMap.push(event);
  }

  tempoMap(): TempoMap {
    return this._tempoMap.slice();
  }

  timeSignatureMap(): TimeSignatureMap {
    return this._timeSignatureMap.slice();
  }

  private addEvent(event: NoteEvent): void {
    this._noteEvents.push(event);
  }
}

/* Division */

//Tick-based resolution for MIDI data (stream, file, track), in the MIDI header
class TickDivision {
  constructor(readonly ticksPerQuarterNote: number) {}
}

/* Re-mapping */

//Maps MIDI note events one at a time from one note or articulation to another
export interface MidiMap {
  remap(event: Readonly<NoteEvent>): NoteEvent;
}

/* Tempo */

//An ordered sequence of the initial tempo followed by any changes in tempo
export type TempoMap = SetTempoEvent[];

//A Set Tempo event, that sets the tempo of the track in beats per minute
export class SetTempoEvent {
  constructor(
    readonly beatsPerMinute: number,
    readonly when: EventTime,
  ) {}
}

export type SetTempoEventParams = {
  beatsPerMinute: number;
  when: EventTime;
};

/* Time signature */

//How a measure is broken up into divisions and sub-divisions
class TimeSignature {
  static from(signature: TimeSignatureParams): TimeSignature {
    return new TimeSignature(signature.numDivisions, signature.divisionNote);
  }

  private constructor(
    readonly numDivisions: number,
    readonly divisionNote: number,
  ) {}
}

//A Set Time Signature event, that starts a new time signature at a certain time
export class SetTimeSignatureEvent {
  constructor(
    readonly signature: TimeSignature,
    readonly when: EventTime,
  ) {}
}

//An ordered sequence of the initial time signature followed by any changes
export type TimeSignatureMap = SetTimeSignatureEvent[];

export type TimeSignatureParams = {
  numDivisions: number;
  divisionNote: number;
};
