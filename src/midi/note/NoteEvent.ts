import { FileHandle } from 'fs/promises';

import { DeltaTime } from '@src/midi/event/DeltaTime';
import { MidiEvent } from '@src/midi/event/MidiEvent';
import { writeBytes } from '@src/midi/io/io-fns';
import { MidiNote } from '@src/midi/note/MidiNote';

//A timed event related to a note, along with how it is played.
export class NoteEvent extends MidiEvent {
  static off(
    deltaTime: DeltaTime,
    channel: number,
    note: MidiNote,
    velocity: number,
  ): NoteEvent {
    return new NoteEvent(
      deltaTime,
      (8 << 4) + channel,
      channel,
      note,
      velocity,
    );
  }

  static on(
    deltaTime: DeltaTime,
    channel: number,
    note: MidiNote,
    velocity: number,
  ): NoteEvent {
    return new NoteEvent(
      deltaTime,
      (9 << 4) + channel,
      channel,
      note,
      velocity,
    );
  }

  private constructor(
    readonly deltaTime: DeltaTime,
    readonly eventType: number,
    readonly channel: number,
    readonly note: MidiNote,
    readonly velocity: number,
  ) {
    super(deltaTime, eventType);
  }

  withNote(other: MidiNote): NoteEvent {
    return new NoteEvent(
      this.deltaTime,
      this.eventType,
      this.channel,
      other,
      this.velocity,
    );
  }

  async writePayload(file: FileHandle): Promise<number> {
    return writeBytes(file, [this.note.noteNumber, this.velocity]);
  }
}
