
import { filterPackagesByName } from './filter-packages';
import { findPackages } from './find-packages';
import { getIgnoreRules } from './ignore-rules';
import { ForEachPackageOptions } from './options';
import { runCommandsSequentially } from './run-commands';


export async function forEachPackage(
  options: ForEachPackageOptions

): Promise<void> {

  const basePath = (options.cwd || process.cwd());

  // Loading ignore rules
  const ignoreRules = await getIgnoreRules(basePath);

  // Looking for packages recursively
  let packages = await findPackages(basePath, ignoreRules);

  // Filtering packages by their name if requested
  if (options.packageName) {
    packages = await filterPackagesByName(packages, options.packageName);
  }

  // Running the specified command for each found package
  // -----

  await runCommandsSequentially({
    packages,
    command: options.command,
    shell: options.shell,
  });

}
