import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';

import MidiTrack from '@/src/midi/MidiTrack';

let ezdrummerTrack: MidiTrack;
let gmTrack: MidiTrack;

Given('I have exported an EZDrummer 2 track from my DAW, as MIDI', () => {
  //C0 24 (Hats Open 1): No GM mapping
  ezdrummerTrack = new MidiTrack(120);
  ezdrummerTrack.addNote({ measure: 1, beat: 1, tick: 0 }, 24, {
    velocity: 100,
  });
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
    expect(gmTrack.noteTimes()).to.eql(ezdrummerTrack.noteTimes());
  },
);

Then(
  'non-standard notes should be changed to their equivalent in General MIDI',
  () => {
    return 'pending';
    //42 F#1 (Closed Hi Hat)
    // expect(generalMidi.noteAt({ measure: 1, beat: 1, tick: 0 })).to.eql(42);
  },
);
