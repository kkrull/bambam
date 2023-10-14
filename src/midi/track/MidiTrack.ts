import { DeltaTime, NoteEvent, MidiNoteProperties } from './NoteEvent';

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
  private noteEvents: NoteEvent[] = [];

  build(): MidiTrack {
    throw Error('not implemented');
  }

  addEndTrackEvent(_deltaTime: number): MidiTrackBuilder {
    throw Error('not implemented');
  }

  addNoteEvent(
    _deltaTime: number,
    _noteNumber: number,
    _how: MidiNoteProperties,
  ): MidiTrackBuilder {
    throw Error('not implemented');
  }

  withTicksDivision(ticksPerQuarterNote: number): MidiTrackBuilder {
    this.division = new TickDivision(ticksPerQuarterNote);
    return this;
  }
}

//Transforms MIDI events one at a time, such as from one note to another.
export interface MidiMap {
  remap(event: Readonly<NoteEvent>): NoteEvent;
}

//Tick-based resolution for MIDI data (stream, file, track), in the MIDI header.
export class TickDivision {
  constructor(readonly ticksPerQuarterNote: number) {}
}
