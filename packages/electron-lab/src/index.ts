import chalk from 'chalk';
import { BrowserWindowConstructorOptions, BrowserWindow } from 'electron';
import { log } from './utils';

declare type getEntryFunc = ((port: string, entryName?: string) => string) &
  ((entryName?: string) => string);

declare const _getEntry: getEntryFunc;

declare const _PORT: string;

declare const _IS_DEV: boolean;

declare const _FOUND_ENTRIES: string[];

export const getEntry = (entryName?: string): string => {
  if (entryName && _IS_DEV && !_FOUND_ENTRIES.includes(entryName)) {
    log.error(
      `Entry: ${entryName} not found in dir ${chalk.yellow(
        '"src/renderer/windows"',
      )}. Please add ${chalk.yellow(`"src/renderer/windows/${entryName}/index.tsx"`)}.`,
    );
    return '';
  }
  if (_IS_DEV) {
    const port = _PORT;
    return _getEntry(port, entryName);
  }
  return _getEntry(entryName);
};

export const openSubWindow = ({
  entry,
  ...rest
}: BrowserWindowConstructorOptions & { entry: string }): BrowserWindow => {
  const win = new BrowserWindow({
    ...rest,
    show: false,
  });
  win.loadURL(entry);
  win.on('ready-to-show', () => {
    win.show();
  });
  return win;
};
