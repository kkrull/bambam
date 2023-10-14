import { FileHandle, FileReadResult, open } from 'node:fs/promises';
import path from 'node:path';

import { MidiTrack, MidiTrackBuilder } from '@/src/midi/track/MidiTrack';
import { MidiSource } from '@/support/midi-source/MidiSource';
import { MidiEvent } from '@/src/midi/track/event-data';

//File-based MIDI track with a mapping of the drums available to EZDrummer 2.
export class FileMappingMidiSource implements MidiSource {
  private readonly midiPath = path.join(
    __dirname,
    '../../../data/ezd-mapping.mid',
  );

  async readTrack(): Promise<MidiTrack> {
    const fh = await openFile(this.midiPath);
    const stat = await fh.stat();
    console.log(`File: ${stat.size} bytes`);

    const headerChunk = await readChunk(fh);
    console.log(`${headerChunk.typeName}: ${headerChunk.length} bytes`);
    headerChunk.data
      .toHexRows(16)
      .forEach((hexRow, i) => console.log(`${i * 16}:\t${hexRow.join(' ')}`));

    const trackChunks = [];
    let trackChunk = await readChunk(fh);
    trackChunks.push(trackChunk);
    while (trackChunk.length !== 0) {
      console.log(`${trackChunk.typeName}: ${trackChunk.length} bytes`);
      trackChunk = await readChunk(fh);
      trackChunks.push(trackChunk);
    }

    await fh.close();

    const ezdChunk = trackChunks[trackChunks.length - 1];
    const midiTrack = new MidiTrackBuilder().withDivisionInTicks(960);
    readEvents(ezdChunk);
    return midiTrack.build();
  }
}

async function openFile(filename: string): Promise<FileHandle> {
  return open(filename, 'r');
}

function readEvents(_trackChunk: MidiChunk): MidiEvent[] {
  return [];
}

async function readChunk(fh: FileHandle): Promise<MidiChunk> {
  const chunkType = await readBytes(fh, 4);
  if (chunkType.length === 0) {
    return new MidiChunk('', 0, new MidiData(Buffer.alloc(0), 0));
  }

  const chunkLength = await readBytes(fh, 4);
  const chunkData = await readBytes(fh, chunkLength.toNumber());
  return new MidiChunk(chunkType.toText(), chunkLength.toNumber(), chunkData);
}

async function readBytes(fh: FileHandle, numBytes: number): Promise<MidiData> {
  const buffer = Buffer.alloc(numBytes);
  const result = await fh.read({ buffer, length: numBytes });
  return MidiData.from(result);
}

class MidiChunk {
  constructor(
    public readonly typeName: string,
    public readonly length: number,
    public readonly data: MidiData,
  ) {}
}

class MidiData {
  static from(result: FileReadResult<Buffer>): MidiData {
    return new MidiData(
      result.buffer.subarray(0, result.bytesRead),
      result.bytesRead,
    );
  }

  constructor(
    private buffer: Buffer,
    public readonly length: number,
  ) {}

  toBytes(): number[] {
    return [...this.buffer];
  }

  toHex(): string[] {
    return this.toBytes().map((x) => Buffer.from([x]).toString('hex'));
  }

  toHexRows(chunkSize: number): string[][] {
    const flatArray = this.toHex();

    const chunks: string[][] = [];
    for (let i = 0; i < flatArray.length; i = i + chunkSize) {
      const chunk = flatArray.slice(i, i + chunkSize);
      chunks.push(chunk);
    }

    return chunks;
  }

  toNumber(): number {
    return this.buffer.readInt32BE(0);
  }

  toText(): string {
    return this.buffer.toString('latin1');
  }

  toObject() {
    return {
      bytes: this.toBytes(),
      hex: this.toHex(),
      number: this.toNumber(),
      text: this.toText(),
    };
  }
}
