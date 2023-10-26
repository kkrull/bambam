import { ofUInt8 } from '@src/midi/buffer-fns';
import { DeltaTime } from '@src/midi/event/DeltaTime';
import { writeUInt8 } from '@src/midi/file/file-fns';
import { Buffer } from 'node:buffer';
import { FileHandle } from 'node:fs/promises';

//Any MIDI event, which is always preceded by a delta time from the prior event.
export abstract class MidiEvent {
  constructor(
    readonly deltaTime: DeltaTime,
    readonly eventType: number,
  ) {}

  async write(file: FileHandle): Promise<number> {
    const deltaTimeBytes = await this.deltaTime.write(file);
    const eventTypeBytes = await writeUInt8(file, this.eventType);
    const payloadBytes = await this.writePayload(file);
    return deltaTimeBytes + eventTypeBytes + payloadBytes;
  }

  abstract eventBytes(): Buffer;

  toBytes(): Buffer {
    return Buffer.concat([
      this.deltaTime.toBytes(),
      ofUInt8(this.eventType),
      this.eventBytes(),
    ]);
  }

  abstract writePayload(file: FileHandle): Promise<number>;
}
