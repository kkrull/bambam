import path from 'node:path';

import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { parseHeader } from '@src/midi/header/header-fns';
import { openFile } from '@src/midi/io/io-fns';
import { MidiTrack } from '@src/midi/track/MidiTrack';
import { MidiTrackBuilder } from '@src/midi/track/MidiTrackBuilder';
import { readEvents } from '@src/midi/track/track-fns';
import { MidiSource } from '@support/midi-source/MidiSource';

//File-based MIDI track with a mapping of the drums available to EZDrummer 2.
export class FileMappingMidiSource implements MidiSource {
  private readonly midiPath = path.join(
    __dirname,
    'modern-original-mix-type-1.mid',
  );

  //TODO KDK: De-duplicate
  async readTrack(): Promise<MidiTrack> {
    const file = await openFile(this.midiPath);
    const headerChunk = await MidiChunk.read(file);

    const { format, numTracks, division } = parseHeader(headerChunk);
    this.verifyFormat(1, format);
    this.verifyNumTracks(2, numTracks);

    const trackChunks: MidiChunk[] = [];
    let trackChunk = await MidiChunk.read(file);
    while (!trackChunk.isEmpty()) {
      trackChunks.push(trackChunk);
      trackChunk = await MidiChunk.read(file);
    }

    await file.close();

    const ezdChunk = trackChunks[trackChunks.length - 1];
    const midiTrack = new MidiTrackBuilder();
    midiTrack.withDivisionInTicks(division.ticksPerQuarterNote);
    readEvents(ezdChunk).forEach((x) => midiTrack.addMidiEvent(x));
    return midiTrack.build();
  }

  private verifyFormat(expected: number, actual: number): void {
    if (actual !== expected) {
      throw Error(`Unsupported format ${actual}: ${this.midiPath}`);
    }
  }

  private verifyNumTracks(expected: number, actual: number): void {
    if (actual !== expected) {
      throw Error(
        `Expected ${this.midiPath} to have ${expected} tracks, but has: ${actual}`,
      );
    }
  }
}
