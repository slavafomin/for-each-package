
import globToRegExp from 'glob-to-regexp';

import { FoundPackage } from './find-packages';
import { PackageNameFilter } from './options';


export async function filterPackagesByName(
  packages: FoundPackage[],
  packageNameFilter: PackageNameFilter

): Promise<FoundPackage[]> {

  const matchedPackages: FoundPackage[] = [];

  for (const $package of packages) {

    // Casting glob pattern to RegExp
    if (typeof packageNameFilter === 'string') {
      packageNameFilter = globToRegExp(packageNameFilter, {
        extended: true,
      });
    }

    // Testing if package name matches the RegExp
    if (packageNameFilter.test($package.name)) {
      matchedPackages.push($package);
    }

  }

  return matchedPackages;

}
