//How a measure is broken up into divisions and sub-divisions
export class TimeSignature {
  static from(signature: TimeSignatureParams): TimeSignature {
    return new TimeSignature(signature.numDivisions, signature.divisionNote);
  }

  private constructor(
    readonly numDivisions: number,
    readonly divisionNote: number,
  ) {}
}

export type TimeSignatureParams = {
  numDivisions: number;
  divisionNote: number;
};
