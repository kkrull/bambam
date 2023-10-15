//Any MIDI event, which is always preceded by a delta time from the prior event.
export abstract class MidiEvent {
  constructor(readonly deltaTime: DeltaTime) {}
}

//Time elapsed between an event and the one just before it.
export class DeltaTime {
  static ofTicks(ticks: number): DeltaTime {
    return new DeltaTime(ticks);
  }

  private constructor(readonly ticks: number) {}

  plus(other: DeltaTime): DeltaTime {
    return new DeltaTime(this.ticks + other.ticks);
  }
}
