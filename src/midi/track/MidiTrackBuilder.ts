import { DeltaTime } from '@src/midi/event/DeltaTime';
import { MidiEvent } from '@src/midi/event/MidiEvent';
import { MidiNote } from '@src/midi/note/MidiNote';
import { NoteEvent } from '@src/midi/note/NoteEvent';
import { EndTrackEvent } from '@src/midi/track/EndTrackEvent';
import { MidiTrack } from '@src/midi/track/MidiTrack';
import { TickDivision } from '@src/midi/track/TickDivision';

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
