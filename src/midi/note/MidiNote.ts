//A note that can be played on a MIDI device.
export class MidiNote {
  static numbered(value: number): MidiNote {
    return new MidiNote(value);
  }

  private constructor(readonly noteNumber: number) {}
}
