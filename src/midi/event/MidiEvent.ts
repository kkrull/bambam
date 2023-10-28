import { ofUInt8 } from '@src/midi/buffer-fns';
import { DeltaTime } from '@src/midi/event/DeltaTime';
import { Buffer } from 'node:buffer';

//Any MIDI event, which is always preceded by a delta time from the prior event.
export abstract class MidiEvent {
  constructor(
    readonly deltaTime: DeltaTime,
    readonly eventType: number,
  ) {}

  abstract eventBytes(): Buffer;

  toBytes(): Buffer {
    return Buffer.concat([
      this.deltaTime.toBytes(),
      ofUInt8(this.eventType),
      this.eventBytes(),
    ]);
  }
}
