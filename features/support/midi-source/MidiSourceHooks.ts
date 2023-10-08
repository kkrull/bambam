import { Before } from '@cucumber/cucumber';

import { FileMidiSource } from './FileMidiSource';
import { MidiSourceProvider } from './MidiSource';
import { StaticMidiSource } from './StaticMidiSource';

Before({ tags: '@FileMidiSource' }, () => {
  const provider = MidiSourceProvider.getInstance();
  provider.setSource(new FileMidiSource());
});

Before({ tags: '@StaticMidiSource' }, () => {
  const provider = MidiSourceProvider.getInstance();
  provider.setSource(new StaticMidiSource());
});
