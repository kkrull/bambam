import { MidiChunk } from '@src/midi/chunk/MidiChunk';
import { MidiData } from '@src/midi/chunk/MidiData';
import { DeltaTime } from '@src/midi/event/DeltaTime';
import { MetaEvent } from '@src/midi/event/MetaEvent';
import { MidiEvent } from '@src/midi/event/MidiEvent';
import { MidiNote } from '@src/midi/note/MidiNote';
import { NoteEvent } from '@src/midi/note/NoteEvent';
import { EndTrackEvent } from '@src/midi/track/EndTrackEvent';

/* Track chunks */

export function readEvents(trackChunk: MidiChunk): MidiEvent[] {
  //<Track Chunk> = <chunk type> <length> <MTrk event>+
  const events: MidiEvent[] = [];
  while (!trackChunk.data.isDoneReading()) {
    const event = readEvent(trackChunk.data);
    events.push(event);
  }

  return events;
}

export function readEvent(trackData: MidiData): MidiEvent {
  //<MTrk event> = <delta-time> <event>
  //<event> = <MIDI event> | <sysex event> | <meta-event>
  const deltaTime = DeltaTime.ofTicks(trackData.readQuantity());
  const eventType = trackData.readUInt8();
  if (eventType === 0xff) {
    const subType = trackData.readUInt8();
    const length = trackData.readQuantity();
    if (subType === 0x2f) {
      //<End of Track> = FF 2F 00
      return new EndTrackEvent(deltaTime);
    }

    //<meta-event> = FF <type> <length> <bytes>
    const data = trackData.readData(length);
    return new MetaEvent(deltaTime, eventType, subType, length, data);
  } else if (0x80 <= eventType && eventType < 0x90) {
    //<Note off> = 8n note velocity
    const noteNumber = trackData.readUInt8();
    const velocity = trackData.readUInt8();
    return NoteEvent.off(
      deltaTime,
      eventType & 0x0f,
      MidiNote.numbered(noteNumber),
      velocity,
    );
  } else if (0x90 <= eventType && eventType < 0xa0) {
    //<Note on> = 9n note velocity
    const noteNumber = trackData.readUInt8();
    const velocity = trackData.readUInt8();
    return NoteEvent.on(
      deltaTime,
      eventType & 0x0f,
      MidiNote.numbered(noteNumber),
      velocity,
    );
  }

  throw Error(
    `Unknown event type with delta time ${deltaTime.ticks}: ${eventType}`,
  );
}
