import path from 'node:path';

import { openFile, readChunk } from '@/src/midi/track/io';
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
    const headerChunk = await readChunk(fh);
    console.log(`${headerChunk.typeName}: ${headerChunk.length} bytes`);

    const trackChunks = [];
    let trackChunk = await readChunk(fh);
    while (!trackChunk.isEmpty()) {
      trackChunks.push(trackChunk);
      console.log(`${trackChunk.typeName}: ${trackChunk.length} bytes`);
      trackChunk = await readChunk(fh);
    }

    await fh.close();

    const _ezdChunk = trackChunks[trackChunks.length - 1];
    const midiTrack = new MidiTrackBuilder().withDivisionInTicks(960);
    // readEvents(ezdChunk).forEach((x) => midiTrack.addMidiEvent(x));
    return midiTrack.build();
  }
}
