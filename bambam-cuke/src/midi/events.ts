export type NoteEvent = {
  when: EventTime;
  noteNumber: number;
  how: NoteProperties;
};

export type EventTime = {
  measure: number;
  beat: number;
  tick: number;
};

export type NoteProperties = {
  velocity: number;
};
