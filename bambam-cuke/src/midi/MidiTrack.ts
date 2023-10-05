class MidiTrack {
  constructor(private readonly bpm: number) {}

  addNote(
    noteNumber: number,
    when: { measure: number; beat: number; tick: number },
    how: { velocity: number },
  ) {
    throw new Error('Method not implemented.');
  }

  beatsPerMinute(): number {
    return 120;
  }

  toGeneralMidi(): MidiTrack {
    return new MidiTrack(this.bpm);
  }
}

export default MidiTrack;
