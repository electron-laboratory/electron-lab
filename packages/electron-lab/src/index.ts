import { BrowserWindowConstructorOptions, BrowserWindow } from 'electron';

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
