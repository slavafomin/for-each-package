
export interface ForEachPackageOptions {

  /**
   * Shell command to execute.
   */
  command: string;

  /**
   * Root directory that should be searched for packages.
   */
  cwd?: string;

  /**
   * Glob or RegExp to filter found packages by their name.
   */
  packageName?: PackageNameFilter;

  /**
   * Whether to use shell to execute the specified command
   *
   * false          - do not use shell
   * true (default) - use default shell (/bin/sh on UNIX and cmd.exe on Windows)
   * string         - use the specified shell
   */
  shell?: (boolean | string);

}

export type PackageNameFilter = (string | RegExp);
