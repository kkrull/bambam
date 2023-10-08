import { EventTime } from '@/src/midi/EventTime';
import { TimeSignature } from './TimeSignature';

//Starts a new time signature that begins at a specified time
export class SetTimeSignatureEvent {
  constructor(
    readonly signature: TimeSignature,
    readonly when: EventTime,
  ) {}
}
