
# for-each-package

<!-- NPM Badge -->
<a href="https://badge.fury.io/js/%40sfomin%2Ffor-each-package">
  <img src="https://badge.fury.io/js/%40sfomin%2Ffor-each-package.svg" alt="npm version" height="18">
</a>

<!-- MIT License Badge -->
<a href="https://opensource.org/licenses/MIT">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" height="20">
</a>

---

Runs command for each npm package under current working directory.

## Features

- searches for npm packages under the current directory recursively
  and executes the specified command for each found package
- respects `.gitignore` settings of your project
- can filter packages by their name from `package.json`
- provides both CLI and JavaScript API
- type-safe (written in TypeScript and ships with type declarations)
- supports shell expressions in commands


## Installation

`npm i -g @sfomin/for-each-package`

## CLI

The installed package provides global binary called
`for-each-package` or a short alias `fep`.

### Examples

`for-each-package "command with args"` - this would execute `command` for each npm package
found under the current working directory
(skipping the paths like `/node_modules` and paths from `.gitignore`).

E.g.: `for-each-package "pwd; echo; ls -l"` would print path of each package
and would list all files in that directory.

The following calls will run the specified command in all packages
that match `@acme/*` pattern:

- `for-each-package --name "@acme/*" "command"` or
- `for-each-package -n "@acme/*" "command"` or
- `fep -n "@acme/*" "command"`


### Options (CLI)

`--name | -n` - filters found packages by name using the
specified glob pattern or regular expression.
Regular expression should be specified this way: `"/^@acme\/$/"`
(between two slashes). Glob pattern should adhere to the
extended format supported by [glob-to-regexp][glob-to-regexp].


## JavaScript API

This package could also be used programmatically, i.e. directly
from your Node.js program:

```typescript

import { forEachPackage } from '@sfomin/for-each-package';

await forEachPackage({
  cwd: '/var/packages',
  command: 'pwd && ls -l',
  packageName: /^@acme\//
});
```

### Options (JS API)

`command: string` - shell command to execute for each found package

`cwd?: string` - root directory that should be searched for packages

`packageName?: string | RegExp` - package name filter glob pattern or RegExp

`shell?: (boolean | string) = true` - whether to use shell to execute the specified command

* `false`          - do not use shell
* `true` (default) - use default shell (/bin/sh on UNIX and cmd.exe on Windows)
* `string`         - use the specified shell


## License (MIT)

Copyright (c) 2020 Slava Fomin II

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


  [glob-to-regexp]: https://github.com/fitzgen/glob-to-regexp#readme
