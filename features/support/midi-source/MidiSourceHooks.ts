import { After, Before } from '@cucumber/cucumber';

import { MidiSourceProvider } from './MidiSourceProvider';
import { FileMappingMidiSource } from './mapping/FileMappingMidiSource';
import { StaticMappingMidiSource } from './mapping/StaticMappingMidiSource';

After(() => {
  MidiSourceProvider.clearInstance();
});

Before({ tags: '@FileMidiSource' }, () => {
  MidiSourceProvider.setInstance(new FileMappingMidiSource());
});

Before({ tags: '@StaticMidiSource' }, () => {
  MidiSourceProvider.setInstance(new StaticMappingMidiSource());
});
