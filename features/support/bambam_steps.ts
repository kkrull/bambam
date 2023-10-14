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
  const midiMap = EZDrummerMidiMap.version2Map();
  gmTrack = ezDrummerTrack.remap(midiMap);
});

/* Track structure */

Then('the re-mapped track should be a valid MIDI track', () => {
  expect(gmTrack.endTime()).to.eql(ezDrummerTrack.endTime());
  expect(gmTrack.endTime()).to.exist;
});

Then('the re-mapped track should have events at the same times as the original', () => {
  const sourceDeltas = ezDrummerTrack.allEvents().map((x) => x.deltaTime.ticks);
  const mappedDeltas = gmTrack.allEvents().map((x) => x.deltaTime.ticks);
  expect(mappedDeltas).to.eql(sourceDeltas);
});

Then('the re-mapped track should have the same time resolution as the original', () => {
  expect(gmTrack.division).to.eql(ezDrummerTrack.division);
  expect(gmTrack.division).to.exist;
});

Then('the re-mapped track should have all other events from the original track', () => {
  return 'pending';
});

/* Note mapping */

Then('re-mapped notes should be on the same MIDI channel as the source notes', () => {
  const sourceChannels = ezDrummerTrack.noteEvents().map((x) => x.channel);
  const mappedChannels = gmTrack.noteEvents().map((x) => x.channel);
  expect(mappedChannels).to.eql(sourceChannels);
});

Then('re-mapped notes should exist in the General MIDI Percussion map', () => {
  const nonGmNotes = gmTrack
    .noteEvents()
    .filter((x) => x.note.noteNumber < 35)
    .filter((x) => x.note.noteNumber > 81);

  expect(nonGmNotes).to.be.empty;
});

Then('re-mapped notes should happen at the same time as the source notes', () => {
  const sourceTimes = ezDrummerTrack.noteEventTimes();
  const mappedTimes = gmTrack.noteEventTimes();
  expect(mappedTimes).to.deep.equal(sourceTimes);
});
