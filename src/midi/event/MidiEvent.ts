import { FileHandle } from 'fs/promises';
import { DeltaTime } from '@src/midi/event/DeltaTime';

//Any MIDI event, which is always preceded by a delta time from the prior event.
export abstract class MidiEvent {
  constructor(
    readonly deltaTime: DeltaTime,
    readonly eventType: number,
  ) {}

  write(_targetFile: FileHandle): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
