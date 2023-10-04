import { Given, Then, When } from '@cucumber/cucumber';

Given('I have exported an EZDrummer 2 track from my DAW, as MIDI', () => {
  return 'pending';
});

When('I ask BamBam to convert that track to General MIDI', () => {
  return 'pending';
});

Then('BamBam should create a track that plays back at the same tempo', () => {
  return 'pending';
});

Then(
  'the General MIDI track should play the same drum pattern as the original',
  () => {
    return 'pending';
  },
);

Then(
  'non-standard notes should be changed to their equivalent in General MIDI',
  () => {
    return 'pending';
  },
);
