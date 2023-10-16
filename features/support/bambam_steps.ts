import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';

import { EZDrummerMidiMap } from '@/src/ezd/EZDrummerMidiMap';
import { MidiTrack } from '@/src/midi/track/MidiTrack';
import { MidiSourceProvider } from '@/support/midi-source/MidiSourceProvider';

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

Then('the re-mapped track should have the same time resolution as the original', () => {
  expect(gmTrack.division).to.eql(ezDrummerTrack.division);
  expect(gmTrack.division).to.exist;
});

Then('the re-mapped track should have all non-note events from the original', () => {
  expect(gmTrack.nonNoteEvents()).to.deep.equal(ezDrummerTrack.nonNoteEvents());
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

Then('the re-mapped track should have re-mapped notes', () => {
  const sourceData = ezDrummerTrack.noteEventTimes();
  const mappedData = gmTrack.noteEventTimes();
  expect(mappedData).to.have.lengthOf(sourceData.length);

  const sourceTimes = sourceData.map((x) => x.ticksFromStart);
  const mappedTimes = mappedData.map((x) => x.ticksFromStart);
  expect(mappedTimes).to.eql(sourceTimes);

  //TODO KDK: The file has different events, such as note on with velocity 0.  Re-sync static mapping with it.
  const ezdHatsOpen = sourceData[2];
  const gmHatsOpen = mappedData[2];
  expect(gmHatsOpen.ticksFromStart).to.eql(sourceData[1].ticksFromStart);
  expect(gmHatsOpen.event.channel).to.eql(ezdHatsOpen.event.channel);
  expect(gmHatsOpen.event.note.noteNumber).to.eql(42);
  expect(gmHatsOpen.event.velocity).to.eql(ezdHatsOpen.event.velocity);
});
