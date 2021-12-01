import { BrowserWindow, app } from 'electron';
import { join } from 'path';
import some from 'some-package';
some;

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({});
  // and load the index.html of the app.
  mainWindow.loadURL(require(join('../entry.js')).index);
  mainWindow.webContents.openDevTools();
};
app.on('ready', createWindow);
