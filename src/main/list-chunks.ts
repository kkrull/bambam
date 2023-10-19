//TODO KDK: Make a new version that uses the library and the command pattern
//npm run main:list-chunks features/support/midi-source/mapping/modern-original-mix-type-1.mid

class ListChunksCommand {
  static parseArgv(argv: string[]): Promise<ListChunksCommand> {
    if (argv.length !== 3) {
      return Promise.reject(`Usage ${argv[0]} ${argv[1]} <MIDI file>`);
    }

    return Promise.resolve(new ListChunksCommand(argv[2]));
  }

  constructor(readonly filename: string) {}

  async run(): Promise<void> {
    console.log(`Opening: ${this.filename}`);
    return;
  }
}

(async () => {
  const command = await ListChunksCommand.parseArgv(process.argv);
  await command.run();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
