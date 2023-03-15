import { app, BrowserWindow } from 'electron';
import * as remoteMain from '@electron/remote/main';
import { join } from 'path';

const baseUrl = '../';

let mainWindow = null;
remoteMain.initialize();

app.whenReady().then(createWindow);
function createWindow() {
  const win = new BrowserWindow({
    width: 1080,
    height: 1440,
    webPreferences: {
      nodeIntegration: true,
      plugins: true,
      contextIsolation: true,
      backgroundThrottling: false,
      webSecurity: false,
      preload: join(__dirname, 'preload.js'),
    },
    icon: __dirname + '/../resources/images/icon.png',
  });
  remoteMain.enable(win.webContents);
  win.webContents.openDevTools();
  win.loadFile(`${baseUrl}dist/duckling/index.html`);
  mainWindow = win;
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
