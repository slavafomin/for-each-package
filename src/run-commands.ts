
import chalk from 'chalk';
import execa from 'execa';

import { FoundPackage } from './find-packages';


export async function runCommandsSequentially(options: {
  packages: FoundPackage[];
  command: string;
  shell?: (boolean | string);

}): Promise<void> {

  const { packages, command, shell } = options;

  for (const $package of packages) {

    await runCommand({
      $package,
      command,
      shell,
    });

  }

}

async function runCommand(options: {
  $package: FoundPackage;
  command: string;
  shell?: (boolean | string);

}): Promise<void> {

  const { $package, command, shell } = options;

  console.log(chalk.bgCyan.black(
    `${chalk.bold(`[${$package.name}]`)}: ${command}\n`
  ));

  const execution = execa.command(command, {
    cwd: $package.path,
    preferLocal: true,
    localDir: $package.path,
    shell: (shell !== undefined ? shell : true),
  });

  execution.stdout?.pipe(process.stdout);

  await execution;

  console.log('\n');

}
