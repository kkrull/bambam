import { MidiEvent } from './MidiEvent';
import { DeltaTime } from './DeltaTime';

//An event required at the end of a track chunk to show when it ends.
export class EndTrackEvent extends MidiEvent {
  constructor(readonly deltaTime: DeltaTime) {
    super(deltaTime, 255);
  }
}
