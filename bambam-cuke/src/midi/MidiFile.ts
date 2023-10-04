class MidiFile {
  constructor(private readonly bpm: number) {}

  beatsPerMinute(): number {
    return 120;
  }

  toGeneralMidi(): MidiFile {
    return new MidiFile(this.bpm);
  }
}

export default MidiFile;
