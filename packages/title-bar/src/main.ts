import { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';
import {
  WINDOW_CLOSE,
  WINDOW_IS_CLOSABLE,
  WINDOW_IS_MAXIMIZABLE,
  WINDOW_IS_MINIMIZABLE,
  WINDOW_MAXIMIZE,
  WINDOW_MINIMIZE,
  WINDOW_STATE,
  WINDOW_STATE_MAX,
  WINDOW_STATE_NORMAL,
} from './constants';

const windowIdMap = new Map<string, BrowserWindow>();

const getWindow = (windowId: string) => {
  const window = windowIdMap.get(windowId);
  if (!window) {
    throw new Error(`ipcMain on ${WINDOW_CLOSE}: can't found window with id ${windowId}`);
  }
  return window;
};

export const initWindowListener = (mainWindow: BrowserWindow, windowId?: string): void => {
  if (!windowId) {
    windowId = 'index';
  }
  if (windowIdMap.has(windowId)) {
    throw new Error(`initWindowListener: ${windowId} is exist.`);
  }
  windowIdMap.set(windowId, mainWindow);
  mainWindow.on('close', () => {
    removeWindowListener(windowId);
  });
};
export const removeWindowListener = (windowId: string): void => {
  windowIdMap.delete(windowId);
};

ipcMain.on(WINDOW_CLOSE, (e, { windowId: wid }) => {
  const window = getWindow(wid);
  window.close();
  windowIdMap.delete(wid);
});

ipcMain.on(WINDOW_MAXIMIZE, (e, { windowId: wid }) => {
  const window = getWindow(wid);
  if (window.isMaximized()) {
    window.unmaximize();
    window.webContents.send(WINDOW_STATE, WINDOW_STATE_NORMAL);
  } else {
    window.maximize();
    window.webContents.send(WINDOW_STATE, WINDOW_STATE_MAX);
  }
});

ipcMain.on(WINDOW_MINIMIZE, (e, { windowId: wid }) => {
  const window = getWindow(wid);
  window.minimize();
});

ipcMain.handle(WINDOW_IS_CLOSABLE, (e, { windowId: wid }) => {
  const window = getWindow(wid);
  return window.isClosable();
});

ipcMain.handle(WINDOW_IS_MAXIMIZABLE, (e, { windowId: wid }) => {
  const window = getWindow(wid);
  return window.isMaximizable();
});

ipcMain.handle(WINDOW_IS_MINIMIZABLE, (e, { windowId: wid }) => {
  const window = getWindow(wid);
  return window.isMinimizable();
});
