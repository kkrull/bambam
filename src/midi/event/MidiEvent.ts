import { FileHandle } from 'fs/promises';

import { DeltaTime } from '@src/midi/event/DeltaTime';
import { writeUInt8 } from '@src/midi/io/io-fns';

//Any MIDI event, which is always preceded by a delta time from the prior event.
export abstract class MidiEvent {
  constructor(
    readonly deltaTime: DeltaTime,
    readonly eventType: number,
  ) {}

  async write(file: FileHandle): Promise<number> {
    const deltaTimeBytes = await this.deltaTime.write(file);
    const eventTypeBytes = await writeUInt8(file, this.eventType);
    throw Error('got here');
    const payloadBytes = await this.writePayload(file);
    return deltaTimeBytes + eventTypeBytes + payloadBytes;
  }

  abstract writePayload(file: FileHandle): Promise<number>;
}
