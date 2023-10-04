import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';

import MidiFile from '@/src/midi/MidiFile';

let ezdrummerMidi: MidiFile;
let generalMidi: MidiFile;

Given('I have exported an EZDrummer 2 track from my DAW, as MIDI', () => {
  ezdrummerMidi = new MidiFile(120);
});

When('I ask BamBam to convert that track to General MIDI', () => {
  generalMidi = ezdrummerMidi.toGeneralMidi();
});

Then('BamBam should create a track that plays back at the same tempo', () => {
  expect(generalMidi.beatsPerMinute).to.eql(ezdrummerMidi.beatsPerMinute);
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
