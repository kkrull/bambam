import { After, Before } from '@cucumber/cucumber';

import { MidiSourceProvider } from '@support/midi-source/MidiSourceProvider';
import { FileMappingMidiSource } from '@support/midi-source/mapping/FileMappingMidiSource';
import { StaticMappingMidiSource } from '@support/midi-source/mapping/StaticMappingMidiSource';

After(() => {
  MidiSourceProvider.clearInstance();
});

Before({ tags: '@FileMidiSource' }, () => {
  MidiSourceProvider.setInstance(new FileMappingMidiSource());
});

Before({ tags: '@StaticMidiSource' }, () => {
  MidiSourceProvider.setInstance(new StaticMappingMidiSource());
});
