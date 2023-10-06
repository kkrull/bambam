import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';

import EZDrummerMidiMap from '@/src/ezdrummer/EZDrummerMidiMap';
import MidiTrack from '@/src/midi/MidiTrack';

let ezDrummerTrack: MidiTrack;
let gmTrack: MidiTrack;

Given('I have exported an EZDrummer 2 track from my DAW, as MIDI', () => {
  ezDrummerTrack = MidiTrack.withTicksDivision(960);
  ezDrummerTrack.setTempo(120, { measure: 1, beat: 1, tick: 0 });
  ezDrummerTrack.setTimeSignature(
    { numDivisions: 4, divisionNote: 4 },
    { measure: 1, beat: 1, tick: 0 },
  );

  //35 B0 Acoustic Bass Drum (GM)
  ezDrummerTrack.addNote({ measure: 1, beat: 1, tick: 0 }, 35, {
    velocity: 100,
  });

  //C0 24 Hats Open 1: No GM mapping
  ezDrummerTrack.addNote({ measure: 1, beat: 2, tick: 0 }, 24, {
    velocity: 100,
  });

  ezDrummerTrack.endTrack({ measure: 2, beat: 1, tick: 0 });
});

When('I ask BamBam to remap that track to General MIDI Percussion', () => {
  const midiMap = EZDrummerMidiMap.version2Map();
  gmTrack = ezDrummerTrack.remap(midiMap);
});

/* Structure and basic usage */

Then('the re-mapped track should be a valid MIDI track that others can read', () => {
  expect(gmTrack.endTime).to.exist;
  expect(gmTrack.endTime).to.eql(ezDrummerTrack.endTime);
});

/* All about timing */

Then('the re-mapped track should play the same drum pattern as the original', () => {
  expect(gmTrack.noteTimes()).to.eql(ezDrummerTrack.noteTimes());
});

Then('the re-mapped track should have the same resolution as the original', () => {
  expect(gmTrack.division).to.exist;
  expect(gmTrack.division).to.eql(ezDrummerTrack.division);
});

Then('the re-mapped track should have the same tempo map as the original', () => {
  expect(gmTrack.tempoMap()).to.deep.equal(ezDrummerTrack.tempoMap());
});

Then('the re-mapped track should have the same time signatures as the original', () => {
  expect(gmTrack.timeSignatureMap()).to.deep.equal(ezDrummerTrack.timeSignatureMap());
});

/* All about notes */

Then('non-standard notes should be changed to their equivalent in General MIDI', () => {
  //42 F#1 Closed Hi Hat (GM)
  expect(gmTrack.noteNumbersAt({ measure: 1, beat: 2, tick: 0 })).to.eql([42]);
});

Then('notes that are already General MIDI Percussion should stay the same', () => {
  expect(gmTrack.noteNumbersAt({ measure: 1, beat: 1, tick: 0 })).to.eql([35]);
});
