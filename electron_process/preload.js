"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROCESS_API = exports.ELECTRON_API = exports.FS_API = exports.PATH_API = void 0;
///<reference path="api.d.ts" />
const electron_1 = require("electron");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const fg = require("fast-glob");
const ipcChannels_1 = require("./ipcChannels");
exports.PATH_API = {
    join: path_1.posix.join,
    dirname: path_1.posix.dirname,
    basename: path_1.posix.basename,
    extname: path_1.posix.extname,
    relative: path_1.posix.relative,
    normalize: path_1.posix.normalize,
    sep: path_1.sep,
};
exports.FS_API = {
    duckling_home: (0, path_1.join)(__dirname, '../'),
    readFile: promises_1.readFile,
    writeFile: promises_1.writeFile,
    access: promises_1.access,
    mkdir: promises_1.mkdir,
    glob: (p) => {
        console.log(__dirname);
        console.log(p);
        return fg(p);
    },
};
exports.ELECTRON_API = {
    window: {
        getSize: () => electron_1.ipcRenderer.invoke(ipcChannels_1.windowSizeChannel),
        setSize: (width, height) => electron_1.ipcRenderer.invoke(ipcChannels_1.windowSetSizeChannel, width, height),
        setMinimumSize: (w, h) => electron_1.ipcRenderer.invoke(ipcChannels_1.windowSetMinimumSizeChannel, w, h),
        center: () => electron_1.ipcRenderer.invoke(ipcChannels_1.windowCenterChannel),
        maximize: () => electron_1.ipcRenderer.invoke(ipcChannels_1.windowMaximizeChannel),
        unmaximize: () => electron_1.ipcRenderer.invoke(ipcChannels_1.windowUnMaximizeChannel),
        setResizable: (r) => electron_1.ipcRenderer.invoke(ipcChannels_1.windowSetResizableChannel, r),
        reload: () => electron_1.ipcRenderer.invoke(ipcChannels_1.windowReloadChannel),
    },
    dialog: {
        showOpen: (options) => electron_1.ipcRenderer.invoke(ipcChannels_1.dialogShowOpenChannel, options),
        showError: (title, content) => electron_1.ipcRenderer.invoke(ipcChannels_1.dialogShowOpenChannel, title, content),
    },
    menu: {
        setApplicationMenu: (content) => electron_1.ipcRenderer.invoke(ipcChannels_1.menuSetApplicationMenuChannel, content),
    },
};
exports.PROCESS_API = {
    home: process.env['HOME'] || process.env['USERPROFILE'],
};
electron_1.contextBridge.exposeInMainWorld('path_api', exports.PATH_API);
electron_1.contextBridge.exposeInMainWorld('fs_api', exports.FS_API);
electron_1.contextBridge.exposeInMainWorld('process_api', exports.PROCESS_API);
electron_1.contextBridge.exposeInMainWorld('electron_api', exports.ELECTRON_API);
//# sourceMappingURL=preload.js.map