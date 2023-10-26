import { ofUInt8, ofVariableLengthQuantity } from '@src/midi/buffer-fns';
import { DeltaTime } from '@src/midi/event/DeltaTime';
import { MidiEvent } from '@src/midi/event/MidiEvent';
import {
  writeBytes,
  writeUInt8,
  writeVariableLengthQuantity,
} from '@src/midi/file/file-fns';
import { Buffer } from 'node:buffer';
import { FileHandle } from 'node:fs/promises';

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

  eventBytes(): Buffer {
    return Buffer.concat([
      ofUInt8(this.subType),
      ofVariableLengthQuantity(this.length),
      Buffer.from(this.data),
    ]);
  }

  async writePayload(file: FileHandle): Promise<number> {
    const subTypeBytes = await writeUInt8(file, this.subType);
    const lengthBytes = await writeVariableLengthQuantity(file, this.length);
    const dataBytes = await writeBytes(file, this.data);
    return subTypeBytes + lengthBytes + dataBytes;
  }
}
