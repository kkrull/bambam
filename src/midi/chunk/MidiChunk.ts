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
    const writeType = await file.write(this.typeNameBuffer());
    const writeLength = await file.write(this.lengthBuffer());
    const writeData = await file.write(this.dataBuffer());
    return (
      writeType.bytesWritten + writeLength.bytesWritten + writeData.bytesWritten
    );
  }

  private dataBuffer(): Buffer {
    return Buffer.from(this.data.asBytes());
  }

  private lengthBuffer(): Buffer {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32BE(this.length);
    return buffer;
  }

  private typeNameBuffer(): Buffer {
    return Buffer.from(this.typeName, 'latin1');
  }
}
