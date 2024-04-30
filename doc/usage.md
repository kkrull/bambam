# Usage

This project uses `npm` to run the code, much like other development tasks.

## `npm run main:copy-chunks <source file> <target file>`

_One of the MIDI chunks carries something of great value. Bring them to me alive and...unspoiled._

In other words, copy a MIDI file one chunk at a time without a care in the world about what is
actually in them. This checks the basic process of reading and writing chunks (even chunk types
that are not recognized), before attempting the more ambitious task of parsing actual events.

### Pro-tip: use `diff` and `xxd` to spot binary differences without questioning the life choices that led you here

```sh
cat original.mid | xxd > original.bin
cat copy.mid | xxd > copy.bin
diff --side-by-side original.bin copy.bin
```

## `npm run main:copy-tracks <source file> <target file>`

Well you made it this far without running away. Maybe this code can start parsing MIDI chunks that
look interesting without messing the data up too badly.

In other words, copy a MIDI file with the added step of parsing chunks and events. A
binary-identical round-trip is really good news here. Go get yourself a cup of coffee. You earned
it.

## `npm run main:list-chunks <file>`

List chunks in a MIDI file.

```sh
npm run main:list-chunks features/data/ezd-mapping.mid
```

## `npm run main:list-events <file>`

List events in a MIDI file.

```sh
npm run main:list-events features/support/midi-source/mapping/modern-original-mix-type-1.mid
```

### Pro-tip: filter and format with `jq`

Pipe output to `jq` to pretty-print the JSON object, so you have a fighting chance of being able to
read it.

```sh
npm run --silent main:list-events \
  features/support/midi-source/mapping/modern-original-mix-type-1.mid | jq
```

You can also use `jq` to select the specific events you want:

```sh
npm run --silent main:list-events \
  features/support/midi-source/mapping/modern-original-mix-type-1.mid \
  | jq '.tracks[1].events[] | { channel: .channel, deltaTime: .deltaTime, note: .note, type: .eventType, subType: .subType, velocity: .velocity }'
```

Note how these both pass `--silent` to `npm run`, to avoid confusing `jq`.

## <a name="remap-events"></a> `npm run main:remap-events <source file> <target file>` <!-- markdownlint-disable-line MD033 -->

This might just be the reason you are here.

Grab a MIDI file overflowing with those non-standard MIDI notes from EZDrummer 2 that we all know
and love, stuff it into this program, skin that smokewagon, and see what happens.

In other words, this will attempt to re-map the EZDrummer 2 events in the source file to their
General MIDI counterparts in the target file. Or at least some reasonable facsimile. Seriously
though, that General MIDI guy is a such a jobber.

```sh
npm run main:remap-events ezdrummer2.mid general-midi.mid
```

**NOW GET OUT THERE AND HIT THOSE MIDI DRUMS LIKE YOU MEAN IT!**

### Step 3: Profit

Drop that General MIDI file you just made into MuseScore.

Congratulations! You've just written a drum part that sounds about as good as it can in MuseScore,
without having to write it one arm or leg at a time. Because we all know that the only thing more
awkward than actually playing the drums and recording it yourself is trying to memorize those
completely arbitrary note letters for each drum and long enough to type in a kick/snare groove
without all the snare hits erasing the last kick hit you just wrote.

Sure those early-90s video games won't sound the same, but this way you'll only hear the vibraslap
and whistle when you **meant** for it to sound that way.
