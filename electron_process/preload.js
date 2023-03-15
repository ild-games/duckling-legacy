"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROCESS_API = exports.ELECTRON_API = exports.FS_API = exports.PATH_API = void 0;
///<reference path="api.d.ts" />
const electron_1 = require("electron");
const remote_1 = require("@electron/remote");
const promises_1 = require("fs/promises");
const path_1 = require("path");
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
    readFile: promises_1.readFile,
    writeFile: promises_1.writeFile,
    access: promises_1.access,
    mkdir: promises_1.mkdir,
};
exports.ELECTRON_API = {
    getCurrentWindow: remote_1.getCurrentWindow,
    dialog: remote_1.dialog,
    Menu: remote_1.Menu,
    MenuItem: remote_1.MenuItem,
};
exports.PROCESS_API = {
    home: process.env['HOME'] || process.env['USERPROFILE'],
};
electron_1.contextBridge.exposeInMainWorld('path_api', exports.PATH_API);
electron_1.contextBridge.exposeInMainWorld('fs_api', exports.FS_API);
electron_1.contextBridge.exposeInMainWorld('process_api', exports.PROCESS_API);
electron_1.contextBridge.exposeInMainWorld('electron_api', exports.ELECTRON_API);
//# sourceMappingURL=preload.js.map