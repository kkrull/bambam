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
    const typeBuffer = Buffer.from(this.typeName, 'latin1');
    const typeWrite = await file.write(typeBuffer);
    return typeWrite.bytesWritten;
  }
}
