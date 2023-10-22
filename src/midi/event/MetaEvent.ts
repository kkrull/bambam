import { FileHandle } from 'fs/promises';

import { DeltaTime } from '@src/midi/event/DeltaTime';
import { MidiEvent } from '@src/midi/event/MidiEvent';
import {
  writeBytes,
  writeUInt8,
  writeVariableLengthQuantity,
} from '@src/midi/io/io-fns';

//A meta event to pass through.
export class MetaEvent extends MidiEvent {
  constructor(
    readonly deltaTime: DeltaTime,
    readonly eventType: number,
    readonly subType: number,
    readonly length: number,
    readonly data: number[],
  ) {
    super(deltaTime, eventType);
  }

  async writePayload(file: FileHandle): Promise<number> {
    const subTypeBytes = await writeUInt8(file, this.subType);
    const lengthBytes = await writeVariableLengthQuantity(file, this.length);
    const dataBytes = await writeBytes(file, this.data);
    return subTypeBytes + lengthBytes + dataBytes;
  }
}
