# `@electron-lab/utils`

A collection of electron development tools.

## Usage

```
import utils from '@electron-lab/utils';

// or

import { ping } from '@electron-lab/utils';

```

## Methods

`execWithPaths(command,options?,callback?)`

> `v0.1.1`

This method automatically replenishes the child environment variables that are lost when the child process is called. On MacOS, this method will be additionally looked up in `/etc/paths`.

## Packages

checkDiskSpace: https://www.npmjs.com/package/check-disk-space

ping: https://www.npmjs.com/package/ping
