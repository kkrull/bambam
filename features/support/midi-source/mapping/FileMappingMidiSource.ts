import { FileHandle, open } from 'node:fs/promises';
import path from 'node:path';

import { MidiEvent } from '@/src/midi/track/MidiEvent';
import { MidiTrack } from '@/src/midi/track/MidiTrack';
import { MidiTrackBuilder } from '@/src/midi/track/MidiTrackBuilder';
import { MidiSource } from '@/support/midi-source/MidiSource';

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
    readEvents(ezdChunk).forEach((x) => midiTrack.addMidiEvent(x));
    return midiTrack.build();
  }
}

async function openFile(filename: string): Promise<FileHandle> {
  return open(filename, 'r');
}

function readEvents(_trackChunk: MidiChunk): MidiEvent[] {
  // _trackChunk.data.readEvent();
  throw Error('Not implemented: Keep calling MidiData#readEvent until empty');
}

async function readChunk(fh: FileHandle): Promise<MidiChunk> {
  const chunkType = await MidiData.read(fh, 4);
  if (chunkType.asText() === '') {
    return new MidiChunk('', 0, MidiData.empty());
  }

  const chunkLength = await MidiData.read(fh, 4);
  const chunkData = await MidiData.read(fh, chunkLength.asInt32());
  return new MidiChunk(chunkType.asText(), chunkLength.asInt32(), chunkData);
}

class MidiChunk {
  constructor(
    public readonly typeName: string,
    public readonly length: number,
    public readonly data: MidiData,
  ) {}
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

  offsetBuffer(): Buffer {
    return this.buffer.subarray(this.offset);
  }

  //<Track Chunk> = <chunk type> <length> <MTrk event>+
  readEvent() {
    if (this.offset === this.buffer.length) {
      return null;
    }

    //<MTrk event> = <delta-time> <event>
    //<event> = <MIDI event> | <sysex event> | <meta-event>
    const deltaTime = this.readQuantity();
    const eventType = this.readUInt8(); //FF

    //<sysex event> = F0 <length> <bytes to be transmitted after F0>
    //<sysex event> = F7 <length> <all bytes to be transmitted>
    if (eventType === 0xff) {
      //<meta-event> = FF <type> <length> <bytes>
      return this.readMetaEvent(deltaTime);
    } else {
      //<MIDI event> = <any channel event>
      return this.readChannelEvent(deltaTime, eventType);
    }
  }

  //TODO KDK: Return NoteEvent
  readChannelEvent(deltaTime: number, eventType: number) {
    switch (eventType) {
      case 0x80: {
        const noteNumber = this.readUInt8();
        const velocity = this.readUInt8();
        return {
          deltaTime,
          name: 'Ch. 01 Event: Note Off',
          eventType,
          noteNumber,
          velocity,
        };
      }

      case 0x90: {
        const noteNumber = this.readUInt8();
        const velocity = this.readUInt8();
        return {
          deltaTime,
          name: 'Ch. 01 Event: Note On',
          eventType,
          noteNumber,
          velocity,
        };
      }

      default:
        throw Error(`Unknown event type: ${eventType}`);
    }
  }

  //TODO KDK: Return MidiEvent
  readMetaEvent(deltaTime: number) {
    const subType = this.readUInt8(); //03
    const length = this.readQuantity();
    const data = [...this.buffer.subarray(this.offset, this.offset + length)];
    this.offset += length;

    return {
      data,
      deltaTime,
      eventType: 0xff,
      eventSubtype: subType,
      length,
      name: 'Meta Event',
    };
  }

  //These numbers are represented 7 bits per byte, most significant bits first.
  //All bytes except the last have bit 7 set, and the last byte has bit 7 clear.
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

  slice(firstOffset: number, endOffset: number): MidiData {
    return new MidiData(this.buffer.subarray(firstOffset, endOffset));
  }

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
