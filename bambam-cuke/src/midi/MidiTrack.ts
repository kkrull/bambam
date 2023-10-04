class MidiTrack {
  constructor(private readonly bpm: number) {}

  beatsPerMinute(): number {
    return 120;
  }

  toGeneralMidi(): MidiTrack {
    return new MidiTrack(this.bpm);
  }
}

export default MidiTrack;
