import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';

import { EZDrummerMidiMap } from '@/src/ezd/EZDrummerMidiMap';
import { MidiTrack } from '@/src/midi/track/MidiTrack';
import { MidiSourceProvider } from './midi-source/MidiSourceProvider';

let ezDrummerTrack: MidiTrack;
let gmTrack: MidiTrack;

Given('I have exported an EZDrummer 2 track from my DAW, as MIDI', async () => {
  const midiSource = MidiSourceProvider.getInstance();
  ezDrummerTrack = await midiSource.readTrack();
});

When('I ask BamBam to remap that track to General MIDI Percussion', () => {
  //TODO KDK: Re-do the static data model
  const midiMap = EZDrummerMidiMap.version2Map();
  gmTrack = ezDrummerTrack.remap(midiMap);
});

/* Track structure */

Then('the re-mapped track should be a valid MIDI track', () => {
  expect(gmTrack.endTime).to.eql(ezDrummerTrack.endTime);
  expect(gmTrack.endTime).to.exist;
});

Then('the re-mapped track should have the same time resolution as the original', () => {
  expect(gmTrack.division).to.eql(ezDrummerTrack.division);
  expect(gmTrack.division).to.exist;
});

/* Note mapping */

Then('re-mapped channel events for General MIDI Percussion notes should stay the same', () => {
  return 'pending';
});

Then(
  're-mapped channel events for non-standard notes should use General MIDI Percussion notes',
  () => {
    //42 F#1 Closed Hi Hat (GM)
    // expect(gmTrack.noteNumbersAt({ measure: 1, beat: 2, tick: 0 })).to.eql([42]);
    return 'pending';
  },
);

Then('the re-mapped track should copy all other events from the original track', () => {
  // expect(gmTrack.noteNumbersAt({ measure: 1, beat: 1, tick: 0 })).to.eql([35]);
  return 'pending';
});
