import { DeltaTime, MidiEvent } from './MidiEvent';
import { EndTrackEvent, MidiNote, NoteEvent } from './events';
import { TickDivision, MidiTrack } from './MidiTrack';

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

  addMidiEvent(_event: MidiEvent): void {
    throw new Error('Method not implemented.');
  }

  addNoteOnEvent(
    deltaTime: DeltaTime,
    { channel, note, velocity }: AddNoteParams,
  ): MidiTrackBuilder {
    this.events.push(NoteEvent.on(deltaTime, channel, note, velocity));
    return this;
  }

  withDivisionInTicks(ticksPerQuarterNote: number): MidiTrackBuilder {
    this.division = new TickDivision(ticksPerQuarterNote);
    return this;
  }
}

export type AddNoteParams = {
  channel: number;
  note: MidiNote;
  velocity: number;
};
