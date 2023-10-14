import { DeltaTime, MidiEvent, MidiNote, NoteEvent } from './event-data';

//A stream of timed, musical events for 1 or more instruments.
export class MidiTrack {
  constructor(
    readonly division: TickDivision,
    readonly endTime: DeltaTime,
  ) {}

  remap(_mapper: MidiMap): MidiTrack {
    throw Error('Not implemented');
  }
}

//Constructs a MIDI track.
export class MidiTrackBuilder {
  private division?: TickDivision;
  private endTime?: DeltaTime;
  private events: MidiEvent[] = [];

  build(): MidiTrack {
    //Add EndTrack event at the very end
    throw Error('not implemented');
  }

  addEndTrackEvent(_deltaTime: DeltaTime): MidiTrackBuilder {
    this.endTime = _deltaTime;
    return this;
  }

  addNoteEvent(
    deltaTime: DeltaTime,
    { channel, note, velocity }: AddNoteParams,
  ): MidiTrackBuilder {
    this.events.push(new NoteEvent(deltaTime, channel, note, velocity));
    return this;
  }

  withTicksDivision(ticksPerQuarterNote: number): MidiTrackBuilder {
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
