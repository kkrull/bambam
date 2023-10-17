class ListEventsCommand {
  static parseArgv(argv: string[]): ListEventsCommand {
    if (argv.length !== 3) {
      throw Error(`Usage ${argv[0]} ${argv[1]} <MIDI file>`);
    }

    return new ListEventsCommand(argv[2]);
  }

  constructor(readonly filename: string) {}
}

ListEventsCommand.parseArgv(process.argv);
//TODO KDK: List out the events, to use as a basis for updating StaticMappingMidiSource
