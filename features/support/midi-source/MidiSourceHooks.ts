import { Before } from '@cucumber/cucumber';
import { StaticMidiSource } from './StaticMidiSource';
import { MidiSourceProvider } from './MidiSource';

Before({ tags: '@StaticMidiSource' }, () => {
  const provider = MidiSourceProvider.getInstance();
  provider.setSource(new StaticMidiSource());
});
