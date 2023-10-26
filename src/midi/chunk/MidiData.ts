import { Buffer } from 'node:buffer';
import { FileHandle } from 'node:fs/promises';

//One or more bytes of MIDI data comprising a single value.
export class MidiData {
  static empty(): MidiData {
    return new MidiData(Buffer.alloc(0));
  }

  static ofBytes(data: Buffer): MidiData {
    return new MidiData(Buffer.from(data));
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

  isEmpty(): boolean {
    return this.buffer.length === 0;
  }

  slice(firstOffset: number, endOffset: number): MidiData {
    return new MidiData(this.buffer.subarray(firstOffset, endOffset));
  }

  /* Decoding the data as a whole */

  asBytes(): number[] {
    return [...this.buffer];
  }

  asHex(): string[] {
    return this.asBytes()
      .map((oneByte) => Buffer.from([oneByte]))
      .map((buffer) => buffer.toString('hex'));
  }

  asHexRows(numColumns: number): string[][] {
    const flatArray = this.asHex();

    const rows: string[][] = [];
    for (let i = 0; i < flatArray.length; i = i + numColumns) {
      const row = flatArray.slice(i, i + numColumns);
      rows.push(row);
    }

    return rows;
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

  /* Decoding the data a few bytes at a time */

  isDoneReading(): boolean {
    return this.offset === this.buffer.length;
  }

  readData(nBytes: number): number[] {
    const bytes = [...this.offsetBuffer()];
    this.offset += nBytes;
    return bytes.slice(0, nBytes);
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
    const bytes = [...this.offsetBuffer()];
    this.offset += 1;
    return bytes[0];
  }

  private offsetBuffer(): Buffer {
    return this.buffer.subarray(this.offset);
  }
}
