
import { dirname, resolve as resolvePath } from 'path';

import { Ignore } from 'ignore';
import loadJsonFile from 'load-json-file';
import readdirp from 'readdirp';

import { manifestFilename } from './consts';


export interface FoundPackage {
  name: string;
  path: string;
}


export async function findPackages(
  basePath: string,
  ignoreRules: Ignore

): Promise<FoundPackage[]> {

  const files = await readdirp.promise(basePath, {
    fileFilter: manifestFilename,
    directoryFilter: ({ path }) => !ignoreRules.ignores(path),
  });

  const packagePaths = (files
  // Working directly with the relative path to "package.json" file
    .map(file => file.path)

  // Running found paths through the filter again
  // (not all cases are excluded using directory filter)
    .filter(ignoreRules.createFilter())

  // Getting rid of filename, leaving only the directory path
    .map(path => resolvePath(basePath, dirname(path)))
  );

  const foundPackages: FoundPackage[] = [];

  for (const path of packagePaths) {

    // Reading package manifest
    const { name } = await loadJsonFile(
      `${path}/${manifestFilename}`
    );

    foundPackages.push({ name, path });

  }

  return foundPackages;

}
