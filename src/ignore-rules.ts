
import { readFile } from 'fs';
import { promisify } from 'util';

import ignore, { Ignore } from 'ignore';

import { builtInIgnores } from './consts';


const $readFile = promisify(readFile);


export async function getIgnoreRules(basePath: string): Promise<Ignore> {

  const ignoreRules = ignore();

  // Adding built-in globs to ignore
  addBuiltInIgnoreRules(ignoreRules);

  // Adding globs from .gitignore file
  await addGlobsFromGitignoreFile(basePath, ignoreRules);

  return ignoreRules;

}

function addBuiltInIgnoreRules(ignoreRules: Ignore): void {
  builtInIgnores.forEach(glob => ignoreRules.add(glob));
}

async function addGlobsFromGitignoreFile(
  basePath: string,
  ignoreRules: Ignore

): Promise<void> {

  try {
    const gitignoreContent = await $readFile(`${basePath}/.gitignore`, {
      encoding: 'utf8',
    });

    ignoreRules.add(gitignoreContent);

  } catch (error) {

    // Suppressing error if the file doesn't exist
    if (error.code !== 'ENOENT') {
      throw error;
    }

  }

}
