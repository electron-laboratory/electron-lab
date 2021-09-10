import { BrowserWindow, app } from 'electron';
import { getEntry } from '../../../../src/index';

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({});
  // and load the index.html of the app.
  mainWindow.loadURL(getEntry());
  mainWindow.webContents.openDevTools();
};
app.on('ready', createWindow);
