class MidiFile {
  beatsPerMinute(): number {
    return 120;
  }

  toGeneralMidi(): MidiFile {
    return new MidiFile();
  }
}

export default MidiFile;
