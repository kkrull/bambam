import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';

import MidiTrack from '@/src/midi/MidiTrack';

let ezdrummerTrack: MidiTrack;
let gmTrack: MidiTrack;

Given('I have exported an EZDrummer 2 track from my DAW, as MIDI', () => {
  ezdrummerTrack = new MidiTrack(120);
});

When('I ask BamBam to convert that track to General MIDI', () => {
  gmTrack = ezdrummerTrack.toGeneralMidi();
});

Then('BamBam should create a track that plays back at the same tempo', () => {
  expect(gmTrack.beatsPerMinute).to.eql(ezdrummerTrack.beatsPerMinute);
});

Then(
  'the General MIDI track should play the same drum pattern as the original',
  () => {
    return 'pending';
    // expect(generalMidi.noteTimes).to.eql(ezdrummerMidi.noteTimes);
  },
);

Then(
  'non-standard notes should be changed to their equivalent in General MIDI',
  () => {
    return 'pending';
    //39 D1 Acoustic Snare; renampped from EZDrummer 2 snare rimshot
    // expect(generalMidi.noteAt({ measure: 1, beat: 1, tick: 0 })).to.eql(38);
  },
);
