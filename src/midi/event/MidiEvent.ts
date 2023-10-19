import { DeltaTime } from './DeltaTime';

//Any MIDI event, which is always preceded by a delta time from the prior event.
export abstract class MidiEvent {
  constructor(
    readonly deltaTime: DeltaTime,
    readonly eventType: number,
  ) {}
}
