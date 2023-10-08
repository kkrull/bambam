import { EventTime } from '../EventTime';

//A Set Tempo event, that sets the tempo of the track in beats per minute
export class SetTempoEvent {
  constructor(
    readonly beatsPerMinute: number,
    readonly when: EventTime,
  ) {}
}

export type SetTempoEventParams = {
  beatsPerMinute: number;
  when: EventTime;
};
