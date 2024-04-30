# MIDI Reference

## General MIDI Percussion key map

> For MIDI Channel 10, each MIDI KEY number ("NOTE#") corresponds to a different drum sound, as
> shown below. While many current instruments also have additional sounds above or below the range
> show here, and may even have additional "kits" with variations of these sounds, only these sounds
> are supported by General MIDI Level 1 devices.

```text
Key# Note Drum Sound        Key# Note Drum Sound
35 B0 Acoustic Bass Drum    59 B2 Ride Cymbal 2
36 C1 Bass Drum 1           60 C3 Hi Bongo
37 C#1 Side Stick           61 C#3 Low Bongo
38 D1 Acoustic Snare        62 D3 Mute Hi Conga
39 Eb1 Hand Clap            63 Eb3 Open Hi Conga
40 E1 Electric Snare        64 E3 Low Conga
41 F1 Low Floor Tom         65 F3 High Timbale
42 F#1 Closed Hi Hat        66 F#3 Low Timbale
43 G1 High Floor Tom        67 G3 High Agogo
44 Ab1 Pedal Hi-Hat         68 Ab3 Low Agogo
45 A1 Low Tom               69 A3 Cabasa
46 Bb1 Open Hi-Hat          70 Bb3 Maracas
47 B1 Low-Mid Tom           71 B3 Short Whistle
48 C2 Hi Mid Tom            72 C4 Long Whistle
49 C#2 Crash Cymbal 1       73 C#4 Short Guiro
50 D2 High Tom              74 D4 Long Guiro
51 Eb2 Ride Cymbal 1        75 Eb4 Claves
52 E2 Chinese Cymbal        76 E4 Hi Wood Block
53 F2 Ride Bell             77 F4 Low Wood Block
54 F#2 Tambourine           78 F#4 Mute Cuica
55 G2 Splash Cymbal         79 G4 Open Cuica
56 Ab2 Cowbell              80 Ab4 Mute Triangle
57 A2 Crash Cymbal 2        81 A4 Open Triangle
58 Bb2 Vibraslap
```

Source:
<https://musescore.org/sites/musescore.org/files/General%20MIDI%20Standard%20Percussion%20Set%20Key%20Map.pdf>

## MIDI format

[Specification](./midi/RP-001_v1-0_Standard_MIDI_Files_Specification_96-1-4.pdf)

Source:
<https://www.midi.org/component/edocman/rp-001-v1-0-standard-midi-files-specification-96-1-4-pdf/fdocument>

## Muse Score 4

Import a MIDI file into MuseScore 4 by drag and drop.

Note: There seems to be a bug in MuseScore 4, when re-importing a MIDI file that has been updated.
If MuseScore seems to be playing notes that you recently updated, try closing MuseScore, opening it
again, and importing the MIDI file again.
