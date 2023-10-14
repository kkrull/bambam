import {
  DeltaTime,
  EndTrackEvent,
  MidiEvent,
  MidiNote,
  NoteEvent,
} from './event-data';

//A stream of timed, musical events for 1 or more instruments.
export class MidiTrack {
  constructor(
    readonly division: TickDivision,
    readonly endTrackEvent: EndTrackEvent,
    readonly events: MidiEvent[],
  ) {}

  endTime(): number {
    const delta = this.events.reduce((acc, x) => acc + x.deltaTime.ticks, 0);
    return delta + this.endTrackEvent.deltaTime.ticks;
  }

  remap(_mapper: MidiMap): MidiTrack {
    //TODO KDK: Map notes using copy constructor and the mapper
    return new MidiTrack(this.division, this.endTrackEvent, this.events);
  }
}

//Constructs a MIDI track.
export class MidiTrackBuilder {
  private division?: TickDivision;
  private endTrack?: EndTrackEvent;
  private events: MidiEvent[] = [];

  build(): MidiTrack {
    if (!this.division) {
      throw Error('Missing time resolution (e.g. ticks per quarter note)');
    } else if (!this.endTrack) {
      throw Error('Missing required End Track event');
    }

    return new MidiTrack(this.division, this.endTrack, this.events.slice());
  }

  addEndTrackEvent(deltaTime: DeltaTime): MidiTrackBuilder {
    this.endTrack = new EndTrackEvent(deltaTime);
    return this;
  }

  addNoteEvent(
    deltaTime: DeltaTime,
    { channel, note, velocity }: AddNoteParams,
  ): MidiTrackBuilder {
    this.events.push(new NoteEvent(deltaTime, channel, note, velocity));
    return this;
  }

  withDivisionInTicks(ticksPerQuarterNote: number): MidiTrackBuilder {
    this.division = new TickDivision(ticksPerQuarterNote);
    return this;
  }
}

type AddNoteParams = {
  channel: number;
  note: MidiNote;
  velocity: number;
};

//Transforms MIDI events one at a time, such as from one note to another.
export interface MidiMap {
  remap(event: Readonly<NoteEvent>): NoteEvent;
}

//Tick-based resolution for MIDI data (stream, file, track), in the MIDI header.
export class TickDivision {
  constructor(readonly ticksPerQuarterNote: number) {}
}
