import { DeltaTime } from '@src/midi/event/DeltaTime';
import { MidiEvent } from '@src/midi/event/MidiEvent';
import { writeBytes } from '@src/midi/file/file-fns';
import { FileHandle } from 'node:fs/promises';

//An event required at the end of a track chunk to show when it ends.
export class EndTrackEvent extends MidiEvent {
  constructor(readonly deltaTime: DeltaTime) {
    super(deltaTime, 0xff);
  }

  eventBytes(): Buffer {
    const endTrackSubType = 0x2f;
    const endTrackEventLength = 0x00;
    return Buffer.from([endTrackSubType, endTrackEventLength]);
  }

  async writePayload(file: FileHandle): Promise<number> {
    const endTrackSubType = 0x2f;
    const endTrackEventLength = 0x00;
    return writeBytes(file, [endTrackSubType, endTrackEventLength]);
  }
}
