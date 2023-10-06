import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';

import EZDrummerMidiMap from '@/src/ezdrummer/EZDrummerMidiMap';
import MidiTrack from '@/src/midi/MidiTrack';

let ezDrummerTrack: MidiTrack;
let gmTrack: MidiTrack;

Given('I have exported an EZDrummer 2 track from my DAW, as MIDI', () => {
  //C0 24 (Hats Open 1): No GM mapping
  //TODO KDK: Add a note that doesn't have to be re-mapped
  //TODO KDK: Add the other notes that have to be re-mapped?
  ezDrummerTrack = new MidiTrack(120);
  ezDrummerTrack.addNote({ measure: 1, beat: 1, tick: 0 }, 24, {
    velocity: 100,
  });
});

When('I ask BamBam to remap that track to General MIDI Percussion', () => {
  const midiMap = EZDrummerMidiMap.version2Map();
  gmTrack = ezDrummerTrack.remap(midiMap);
});

Then('BamBam should create a track that plays back at the same tempo', () => {
  expect(gmTrack.beatsPerMinute).to.eql(ezDrummerTrack.beatsPerMinute);
});

Then(
  'the General MIDI track should play the same drum pattern as the original',
  () => {
    expect(gmTrack.noteTimes()).to.eql(ezDrummerTrack.noteTimes());
  },
);

Then(
  'non-standard notes should be changed to their equivalent in General MIDI',
  () => {
    //42 F#1 (Closed Hi Hat)
    expect(gmTrack.noteNumbersAt({ measure: 1, beat: 1, tick: 0 })).to.eql([
      42,
    ]);
  },
);
