export type Division = {
  ticksPerQuarterNote: number;
};

export type HeaderChunk = {
  format: number;
  numTracks: number;
  division: Division;
};
