import { FileHandle, open } from 'node:fs/promises';

export function openFile(filename: string): Promise<FileHandle> {
  return open(filename, 'r');
}

export async function readChunk(file: FileHandle): Promise<MidiChunk> {
  const chunkType = await MidiData.read(file, 4);
  if (chunkType.isEmpty()) {
    return MidiChunk.empty();
  }

  const chunkLength = await MidiData.read(file, 4);
  const chunkData = await MidiData.read(file, chunkLength.asInt32());
  return new MidiChunk(chunkType.asText(), chunkLength.asInt32(), chunkData);
}

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
}

//One or more bytes of MIDI data comprising a single value
export class MidiData {
  static empty(): MidiData {
    return new MidiData(Buffer.alloc(0));
  }

  static async read(file: FileHandle, nBytes: number): Promise<MidiData> {
    const buffer = Buffer.alloc(nBytes);
    const result = await file.read({ buffer, length: nBytes });
    return new MidiData(result.buffer.subarray(0, result.bytesRead));
  }

  private offset: number;

  private constructor(private readonly buffer: Buffer) {
    this.offset = 0;
  }

  asInt16(): number {
    return this.buffer.readInt16BE(0);
  }

  asInt32(): number {
    return this.buffer.readInt32BE(0);
  }

  asText(): string {
    return this.buffer.toString('latin1');
  }

  isEmpty(): boolean {
    return this.buffer.length === 0;
  }

  offsetBuffer(): Buffer {
    return this.buffer.subarray(this.offset);
  }

  //Variable-length quantity of 1..4 bytes of 7 bits per byte.
  //All bytes except the last have bit 7 set; in the last byte it is clear.
  readQuantity(): number {
    let quantity = 0;
    for (const rawByte of this.offsetBuffer()) {
      this.offset++;

      quantity = (quantity << 7) + (rawByte & 0x7f);
      if ((rawByte & 0x80) === 0) {
        break;
      }
    }

    return quantity;
  }

  readUInt8(): number {
    const bytes = [...this.buffer.subarray(this.offset)];
    this.offset += 1;
    return bytes[0];
  }

  // slice(firstOffset: number, endOffset: number): MidiData {
  //   return new MidiData(this.buffer.subarray(firstOffset, endOffset));
  // }

  toBytes(): number[] {
    return [...this.buffer];
  }

  toObject() {
    return {
      bytes: this.toBytes(),
      number: this.asInt32(),
      text: this.asText(),
    };
  }
}
