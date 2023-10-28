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
    }

    return MidiTrack.withEvents(this.division, this.events);
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
}

export type AddNoteParams = {
  channel: number;
  note: MidiNote;
  velocity: number;
};
