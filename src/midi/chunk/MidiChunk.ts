import { MidiData } from '@src/midi/chunk/MidiData';
import { writeBytes, writeString, writeUInt32 } from '@src/midi/file/file-fns';
import { FileHandle } from 'node:fs/promises';

//Top-level structure for MIDI data.
export class MidiChunk {
  static empty(): MidiChunk {
    return new MidiChunk('', 0, MidiData.empty());
  }

  static async read(file: FileHandle): Promise<MidiChunk> {
    const chunkType = await MidiData.read(file, 4);
    if (chunkType.isEmpty()) {
      return MidiChunk.empty();
    }

    const chunkLength = await MidiData.read(file, 4);
    const chunkData = await MidiData.read(file, chunkLength.asInt32());
    return new MidiChunk(chunkType.asText(), chunkLength.asInt32(), chunkData);
  }

  constructor(
    public readonly typeName: string,
    public readonly length: number,
    public readonly data: MidiData,
  ) {}

  isEmpty(): boolean {
    return this.data.isEmpty();
  }

  get totalSize(): number {
    const typeSize = 4;
    const lengthSize = 4;
    return this.length + typeSize + lengthSize;
  }

  async write(file: FileHandle): Promise<number> {
    const typeSize = await writeString(file, this.typeName);
    const lengthSize = await writeUInt32(file, this.length);
    const dataSize = await writeBytes(file, this.data.asBytes());
    return typeSize + lengthSize + dataSize;
  }
}
