import { ofUInt8, ofVariableLengthQuantity } from '@src/midi/buffer-fns';
import { DeltaTime } from '@src/midi/event/DeltaTime';
import { MidiEvent } from '@src/midi/event/MidiEvent';
import { Buffer } from 'node:buffer';

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
}
