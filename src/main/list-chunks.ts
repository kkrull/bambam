//TODO KDK: Make a new version that uses the library and the command pattern
//npm run main:list-chunks features/support/midi-source/mapping/modern-original-mix-type-1.mid

class ListChunksCommand {
  static parseArgv(_argv: string[]): ListChunksCommand {
    //TODO KDK: Can Promise be used like an Either type, to return an error if usage is wrong?
    return new ListChunksCommand();
  }

  async run(): Promise<void> {
    console.log('running...');
    return;
  }
}

(async (command: ListChunksCommand) => {
  await command.run();
})(ListChunksCommand.parseArgv(process.argv));
