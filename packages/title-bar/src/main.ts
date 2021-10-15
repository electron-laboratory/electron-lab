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
import * as remoteMain from '@electron/remote/main';

import _ from '@electron/remote';
_;



remoteMain.initialize();


export const initWindowListener = (mainWindow: BrowserWindow): void => {
  remoteMain.enable(mainWindow.webContents);
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
