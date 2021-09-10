# babel-plugin-import-to-window-require

## Example

```ts
import { ipcRenderer } from 'electron';
// After the transformation
const { ipcRenderer: ipcRenderer } = window.require('electron');
```

## Usage

```ts
{
  plugins: [
    [
      'babel-plugin-import-to-window-require',
      {
        packages: ['electron'],
      },
    ],
  ];
}
```

## Options

- `packages: string[]`: Determine which packages will be transformed.
