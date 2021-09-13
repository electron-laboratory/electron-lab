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

> works on MacOS only

Environment variables are lost when executing the command line in MacOS. This method tries to find them in `etc/paths`. Native Exec will be used on other operating systems.

## Packages

checkDiskSpace: https://www.npmjs.com/package/check-disk-space

ping: https://www.npmjs.com/package/ping
