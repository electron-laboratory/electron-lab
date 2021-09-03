import type { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';
import {
  WINDOW_CLOSE,
  WINDOW_MAXIMIZE,
  WINDOW_MINIMIZE,
  WINDOW_STATE,
  WINDOW_STATE_MAX,
  WINDOW_STATE_NORMAL,
} from './constants';

export const initWindowListener = (mainWindow: BrowserWindow):void => {
  ipcMain.on(WINDOW_CLOSE, () => {
    mainWindow.close();
  });
  ipcMain.on(WINDOW_MAXIMIZE, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
      mainWindow.webContents.send(WINDOW_STATE, WINDOW_STATE_NORMAL);
    } else {
      mainWindow.maximize();
      mainWindow.webContents.send(WINDOW_STATE, WINDOW_STATE_MAX);
    }
  });
  ipcMain.on(WINDOW_MINIMIZE, () => {
    mainWindow.minimize();
  });
};
