"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const remoteMain = require("@electron/remote/main");
const path_1 = require("path");
const ipcChannels_1 = require("./ipcChannels");
const menuTemplates_1 = require("./menuTemplates");
const baseUrl = '../';
let mainWindow = null;
remoteMain.initialize();
electron_1.app.whenReady().then(createWindow);
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1080,
        height: 1440,
        webPreferences: {
            nodeIntegration: true,
            plugins: true,
            contextIsolation: true,
            backgroundThrottling: false,
            webSecurity: false,
            preload: (0, path_1.join)(__dirname, 'preload.js'),
        },
        icon: __dirname + '/../resources/images/icon.png',
    });
    remoteMain.enable(win.webContents);
    win.webContents.openDevTools();
    win.loadFile(`${baseUrl}dist/duckling/index.html`);
    electron_1.ipcMain.handle(ipcChannels_1.windowSizeChannel, () => win.getSize());
    electron_1.ipcMain.handle(ipcChannels_1.windowSetSizeChannel, (e, w, h) => win.setSize(w, h));
    electron_1.ipcMain.handle(ipcChannels_1.windowSetMinimumSizeChannel, (e, w, h) => win.setMinimumSize(w, h));
    electron_1.ipcMain.handle(ipcChannels_1.windowCenterChannel, () => win.center());
    electron_1.ipcMain.handle(ipcChannels_1.windowMaximizeChannel, () => win.maximize());
    electron_1.ipcMain.handle(ipcChannels_1.windowUnMaximizeChannel, () => win.unmaximize());
    electron_1.ipcMain.handle(ipcChannels_1.windowSetResizableChannel, (e, v) => win.setResizable(v));
    electron_1.ipcMain.handle(ipcChannels_1.windowReloadChannel, () => win.reload());
    electron_1.ipcMain.handle(ipcChannels_1.dialogShowOpenChannel, (e, options) => electron_1.dialog.showOpenDialog(options));
    electron_1.ipcMain.handle(ipcChannels_1.dialogShowErrorChannel, (e, title, content) => electron_1.dialog.showErrorBox(title, content));
    electron_1.ipcMain.handle(ipcChannels_1.menuAddSplashItemsChannel, () => electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(menuTemplates_1.splashMenu)));
    electron_1.ipcMain.handle(ipcChannels_1.menuAddProjectItemsChannel, () => electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(menuTemplates_1.projectMenu)));
    const m = electron_1.Menu.buildFromTemplate(menuTemplates_1.defaultMenu);
    electron_1.Menu.setApplicationMenu(m);
    mainWindow = win;
}
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
//# sourceMappingURL=main.js.map