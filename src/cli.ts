
import { Command, flags } from '@oclif/command';

import { forEachPackage } from './index';


interface CommandFlags {
  name?: string;
}


export = class DefaultCommand extends Command {

  // Allowing any number of arguments
  static strict = false;

  static flags: flags.Input<CommandFlags> = {
    name: flags.string({
      char: 'n',
      description: 'Glob pattern or RegExp to filter packages by name',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parse: (pattern): any => parseNameFlag(pattern),
    }),
  };

  public async run(): Promise<void> {

    const { flags, argv } = this.parse(DefaultCommand);

    await forEachPackage({
      command: argv.join(' && '),
      packageName: flags.name,
    });

  }

}


function parseNameFlag(pattern: string): (string | RegExp) {
  if (pattern.startsWith('/') && pattern.endsWith('/')) {
    return new RegExp(pattern.slice(1, -1));
  } else {
    return pattern;
  }
}
