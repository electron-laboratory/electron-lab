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

The subprocess environment variables are lost when called after the electron build, and this method automatically replenishes the environment variables. On MacOS, this method will be additionally looked up in `/etc/paths`.

example:

```ts
import { execWithPaths } from '@electron-lab/utils';

execWithPaths('docker -v', (err, stdout) => {
  console.log(stdout); // Docker version 20.10.5, build 55c4c88
});
```

## Packages

checkDiskSpace: https://www.npmjs.com/package/check-disk-space

ping: https://www.npmjs.com/package/ping

examples:
```ts
import { ping } from '@electron-lab/utils';
```
