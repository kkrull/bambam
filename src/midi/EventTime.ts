//Musical M:B:T time
export class EventTime {
  static of({ measure, beat, tick }: EventTimeParams): EventTime {
    return new EventTime(measure, beat, tick);
  }

  private constructor(
    readonly measure: number,
    readonly beat: number,
    readonly tick: number,
  ) {}

  isSameAs(other: EventTimeParams): boolean {
    return (
      this.measure === other.measure &&
      this.beat === other.beat &&
      this.tick === other.tick
    );
  }
}

export type EventTimeParams = {
  measure: number;
  beat: number;
  tick: number;
};
