import { Before } from '@cucumber/cucumber';

import { FileMidiSource } from './FileMidiSource';
import { MidiSourceProvider } from './MidiSourceProvider';
import { StaticMidiSource } from './StaticMidiSource';

Before({ tags: '@FileMidiSource' }, () => {
  MidiSourceProvider.setInstance(new FileMidiSource());
});

Before({ tags: '@StaticMidiSource' }, () => {
  MidiSourceProvider.setInstance(new StaticMidiSource());
});
