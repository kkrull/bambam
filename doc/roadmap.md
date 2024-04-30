# Roadmap

## Development strategy

Start in the middle (domain model) and test outwards, via a different driver. Push scenarios down
to unit tests and extract libraries for stable parts.

Prefer over-simplification over using terminology from the solution domain.

## Future work

- Include Marker events?
  - It doesn't define timing or notes, but it does describe structure and form.
  - That might be useful when transferring a MIDI percussion track, to a MuseScore file, for the
    first time.
  - Updates to a MuseScore file that already have a percussion track won't benefit from that
    information.
- Include Key Signature?
  - It may not be very relevant on a percussion track.
