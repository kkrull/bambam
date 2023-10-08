import { EventTime, EventTimeParams } from '@/src/midi/EventTime';
import { TickDivision } from '@/src/midi/division/TickDivision';
import { SetTempoEvent } from '@/src/midi/tempo/SetTempoEvent';
import {
  TimeSignature,
  TimeSignatureParams,
} from '@/src/midi/time-signature/TimeSignature';
import { SetTimeSignatureEvent } from '@/src/midi/time-signature/SetTimeSignatureEvent';
import { NoteEvent, NoteEventParams, NoteProperties } from './NoteEvent';

//A stream of timed, musical events for the same instrument.
export class MidiTrack {
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

//Maps MIDI note events one at a time from one note or articulation to another
export interface MidiMap {
  remap(event: Readonly<NoteEvent>): NoteEvent;
}

//An ordered sequence of the initial tempo followed by any changes in tempo
type TempoMap = SetTempoEvent[];

//An ordered sequence of the initial time signature followed by any changes
type TimeSignatureMap = SetTimeSignatureEvent[];
