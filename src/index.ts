
import readdirp from 'readdirp';
import minimatch from 'minimatch';
import loadJsonFile from 'load-json-file';
import ignore, { Ignore } from 'ignore';
import { readFile } from 'fs';
import { promisify } from 'util';
import { dirname, resolve as resolvePath } from 'path';


export interface ForEachPackageOptions {

  /**
   * Glob or RegExp to filter found packages by their name.
   */
  packageName?: PackageNameFilter;

}

export type PackageNameFilter = (string | RegExp);


const $readFile = promisify(readFile);

const builtInIgnores = [
  '.git/',
  '.idea/',
  'node_modules/',
  'pnpm-store/',
];

const manifestFilename = 'package.json';


export async function forEachPackage(
  options: ForEachPackageOptions

): Promise<void> {

  const basePath = process.cwd();

  const ignoreRules = ignore();

  // Adding built-in globs to ignore
  builtInIgnores.forEach(glob => ignoreRules.add(glob));

  // Adding globs from .gitignore file
  await addGlobsFromGitignoreFile(basePath, ignoreRules);

  // Looking for packages recursively
  let packagePaths = await findPackages(basePath, ignoreRules);

  // Filtering packages by their name if requested
  if (options.packageName) {
    packagePaths = await filterPackagesByName(packagePaths, options.packageName);
  }

  // @todo: execute command

  console.log({ packagePaths });

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

async function findPackages(
  basePath: string,
  ignoreRules: Ignore

): Promise<string[]> {

  let files = await readdirp.promise(basePath, {
    fileFilter: manifestFilename,
    directoryFilter: ({ path }) => !ignoreRules.ignores(path),
  });

  return (files
    // Working directly with the relative path to "package.json" file
    .map(file => file.path)

    // Running found paths through the filter again
    // (not all cases are excluded using directory filter)
    .filter(ignoreRules.createFilter())

    // Getting rid of filename, leaving only the directory path
    .map(path => resolvePath(basePath, dirname(path)))
  );

}

async function filterPackagesByName(
  packagePaths: string[],
  packageNameFilter: PackageNameFilter

): Promise<string[]> {

  const matchedPackages: string[] = [];

  for (const packagePath of packagePaths) {

    const { name: packageName } = await loadJsonFile(
      `${packagePath}/${manifestFilename}`
    );

    const matches = (
      (
        // Matching using glob pattern
        typeof packageNameFilter === 'string' &&
        minimatch(packageName, packageNameFilter)
      ) || (
        // Matching using regular expression
        packageNameFilter instanceof RegExp &&
        packageNameFilter.test(packageName)
      )
    );

    if (matches) {
      matchedPackages.push(packagePath);
    }

  }

  return matchedPackages;

}
