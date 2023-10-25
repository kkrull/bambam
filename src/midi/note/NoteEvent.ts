import { FileHandle } from 'fs/promises';

import { DeltaTime } from '@src/midi/event/DeltaTime';
import { MidiEvent } from '@src/midi/event/MidiEvent';
import { writeBytes } from '@src/midi/file/file-fns';
import { MidiNote } from '@src/midi/note/MidiNote';

//A timed event related to a note, along with how it is played.
export class NoteEvent extends MidiEvent {
  static off(
    deltaTime: DeltaTime,
    channel: number,
    note: MidiNote,
    velocity: number,
  ): NoteEvent {
    const eventType = 0x80 + channel;
    return new NoteEvent(deltaTime, eventType, channel, note, velocity);
  }

  static on(
    deltaTime: DeltaTime,
    channel: number,
    note: MidiNote,
    velocity: number,
  ): NoteEvent {
    const eventType = 0x90 + channel;
    return new NoteEvent(deltaTime, eventType, channel, note, velocity);
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
