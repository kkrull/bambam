import { FileHandle } from 'node:fs/promises';
import { MidiData } from '@src/midi/chunk/MidiData';
import { writeBytes, writeString, writeUInt32 } from '@src/midi/io/io-fns';

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
    const typeSize = await writeString(file, this.typeName);
    const lengthSize = await writeUInt32(file, this.length);
    const dataSize = await writeBytes(file, this.data.asBytes());
    return typeSize + lengthSize + dataSize;
  }
}
