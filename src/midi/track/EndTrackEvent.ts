import { FileHandle } from 'fs/promises';
import { DeltaTime } from '@src/midi/event/DeltaTime';
import { MidiEvent } from '@src/midi/event/MidiEvent';
import { writeBytes } from '@src/midi/io/io-fns';

//An event required at the end of a track chunk to show when it ends.
export class EndTrackEvent extends MidiEvent {
  constructor(readonly deltaTime: DeltaTime) {
    super(deltaTime, 0xff);
  }

  async writePayload(file: FileHandle): Promise<number> {
    const endTrackSubType = 0x2f;
    const endTrackEventLength = 0x00;
    return writeBytes(file, [endTrackSubType, endTrackEventLength]);
  }
}
