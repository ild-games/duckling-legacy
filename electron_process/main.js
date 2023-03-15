"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const baseUrl = '../';
let mainWindow = null;
electron_1.app.whenReady().then(createWindow);
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1080,
        height: 1440,
        webPreferences: {
            preload: (0, path_1.join)(__dirname, 'preload.js'),
        },
        icon: __dirname + '/../resources/images/icon.png',
    });
    win.webContents.openDevTools();
    win.loadFile(`${baseUrl}dist/duckling/index.html`);
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