"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const baseUrl = '../';
electron_1.app.whenReady().then(() => {
    const win = new electron_1.BrowserWindow({ width: 1080, height: 1440 });
    win.loadFile(`${baseUrl}dist/duckling/index.html`);
});
//# sourceMappingURL=main.js.map