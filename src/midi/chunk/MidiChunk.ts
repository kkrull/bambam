import { Buffer } from 'node:buffer';
import { FileHandle } from 'node:fs/promises';

import { MidiData } from '@src/midi/chunk/MidiData';

//Top-level structure for MIDI data.
export class MidiChunk {
  static empty(): MidiChunk {
    return new MidiChunk('', 0, MidiData.empty());
  }

  constructor(
    public readonly typeName: string,
    public readonly length: number,
    public readonly data: MidiData,
  ) {}

  isEmpty(): boolean {
    return this.data.isEmpty();
  }

  async write(file: FileHandle): Promise<number> {
    const writeType = await file.write(Buffer.from(this.typeName, 'latin1'));

    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeInt32BE(this.length);
    const writeLength = await file.write(lengthBuffer);

    return writeType.bytesWritten + writeLength.bytesWritten;
  }
}
