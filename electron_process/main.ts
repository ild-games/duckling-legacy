import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem } from 'electron';
import * as remoteMain from '@electron/remote/main';
import { join } from 'path';
import {
  dialogShowErrorChannel,
  dialogShowOpenChannel,
  menuSetApplicationMenuChannel,
  windowCenterChannel,
  windowMaximizeChannel,
  windowReloadChannel,
  windowSetMinimumSizeChannel,
  windowSetResizableChannel,
  windowSetSizeChannel,
  windowSizeChannel,
  windowUnMaximizeChannel,
} from './ipcChannels';

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

  ipcMain.handle(windowSizeChannel, () => win.getSize());
  ipcMain.handle(windowSetSizeChannel, (e, w, h) => win.setSize(w, h));
  ipcMain.handle(windowSetMinimumSizeChannel, (e, w, h) =>
    win.setMinimumSize(w, h)
  );
  ipcMain.handle(windowCenterChannel, () => win.center());
  ipcMain.handle(windowMaximizeChannel, () => win.maximize());
  ipcMain.handle(windowUnMaximizeChannel, () => win.unmaximize());
  ipcMain.handle(windowSetResizableChannel, (e, v) => win.setResizable(v));
  ipcMain.handle(windowReloadChannel, () => win.reload());

  ipcMain.handle(dialogShowOpenChannel, (e, options) =>
    dialog.showOpenDialog(options)
  );
  ipcMain.handle(dialogShowErrorChannel, (e, title, content) =>
    dialog.showErrorBox(title, content)
  );
  ipcMain.handle(menuSetApplicationMenuChannel, (e, menu) =>
    Menu.setApplicationMenu(toMenu(menu))
  );

  mainWindow = win;
}

function toMenu(menu): Menu {
  const m = new Menu();
  menu.subMenus.forEach((element) => {
    m.append(new MenuItem({ ...element }));
  });
  menu.items.forEach((element) => {
    m.append(new MenuItem({ ...element }));
  });
  return m;
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
