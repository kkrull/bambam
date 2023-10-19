import { MidiEvent } from './MidiEvent';
import { DeltaTime } from './DeltaTime';
import { EndTrackEvent } from './EndTrackEvent';
import { NoteEvent } from './NoteEvent';
import { MidiNote } from './MidiNote';
import { MidiTrack } from './MidiTrack';
import { TickDivision } from './TickDivision';

//Constructs a MIDI track.
export class MidiTrackBuilder {
  private division?: TickDivision;
  private events: MidiEvent[] = [];

  build(): MidiTrack {
    if (!this.division) {
      throw Error('Missing time resolution (e.g. ticks per quarter note)');
    } else if (!this.endTrack()) {
      throw Error('Missing required End Track event');
    }

    return new MidiTrack(this.division, this.endTrack(), this.events.slice());
  }

  addEndTrackEvent(deltaTime: DeltaTime): MidiTrackBuilder {
    this.events.push(new EndTrackEvent(deltaTime));
    return this;
  }

  addMidiEvent(event: MidiEvent): MidiTrackBuilder {
    this.events.push(event);
    return this;
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

  private endTrack(): EndTrackEvent {
    return this.events[this.events.length - 1] as EndTrackEvent;
  }
}

export type AddNoteParams = {
  channel: number;
  note: MidiNote;
  velocity: number;
};
