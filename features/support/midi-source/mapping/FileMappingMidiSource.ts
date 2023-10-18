import path from 'node:path';

import {
  openFile,
  parseHeader,
  readChunk,
  readEvents,
} from '@/src/midi/track/midi-fns';
import { MidiTrack } from '@/src/midi/track/MidiTrack';
import { MidiTrackBuilder } from '@/src/midi/track/MidiTrackBuilder';
import { MidiChunk } from '@/src/midi/track/MidiChunk';
import { MidiSource } from '@/support/midi-source/MidiSource';

//File-based MIDI track with a mapping of the drums available to EZDrummer 2.
export class FileMappingMidiSource implements MidiSource {
  private readonly midiPath = path.join(
    __dirname,
    'modern-original-mix-type-1.mid',
  );

  async readTrack(): Promise<MidiTrack> {
    const file = await openFile(this.midiPath);
    const headerChunk = await readChunk(file);

    const { format, numTracks, division } = parseHeader(headerChunk);
    this.verifyFormat(1, format);
    this.verifyNumTracks(2, numTracks);

    //TODO KDK: Fix the kick drum notes.  They should be note 35 (Kick Alt), not 36 (Kick Hit)
    const trackChunks: MidiChunk[] = [];
    let trackChunk = await readChunk(file);
    while (!trackChunk.isEmpty()) {
      trackChunks.push(trackChunk);
      trackChunk = await readChunk(file);
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
