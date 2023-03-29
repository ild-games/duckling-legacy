///<reference path="api.d.ts" />
import { contextBridge, ipcRenderer } from 'electron';
import { readFile, writeFile, access, mkdir, readdir } from 'fs/promises';
import { posix, sep, join } from 'path';
import * as glob from 'fast-glob';
import {
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

export const PATH_API = {
  join: posix.join,
  dirname: posix.dirname,
  basename: posix.basename,
  extname: posix.extname,
  relative: posix.relative,
  normalize: posix.normalize,
  sep,
};

export const FS_API = {
  duckling_home: join(__dirname, '../'),
  readFile,
  writeFile,
  access,
  mkdir,
  glob
};

export const ELECTRON_API = {
  window: {
    getSize: () => ipcRenderer.invoke(windowSizeChannel),
    setSize: (width, height) =>
      ipcRenderer.invoke(windowSetSizeChannel, width, height),
    setMinimumSize: (w, h) =>
      ipcRenderer.invoke(windowSetMinimumSizeChannel, w, h),
    center: () => ipcRenderer.invoke(windowCenterChannel),
    maximize: () => ipcRenderer.invoke(windowMaximizeChannel),
    unmaximize: () => ipcRenderer.invoke(windowUnMaximizeChannel),
    setResizable: (r) => ipcRenderer.invoke(windowSetResizableChannel, r),
    reload: () => ipcRenderer.invoke(windowReloadChannel),
  },
  dialog: {
    showOpen: (options) => ipcRenderer.invoke(dialogShowOpenChannel, options),
    showError: (title, content) =>
      ipcRenderer.invoke(dialogShowOpenChannel, title, content),
  },
  menu: {
    setApplicationMenu: (content) =>
      ipcRenderer.invoke(menuSetApplicationMenuChannel, content),
  },
};

export const PROCESS_API = {
  home: process.env['HOME'] || process.env['USERPROFILE'],
};

contextBridge.exposeInMainWorld('path_api', PATH_API);
contextBridge.exposeInMainWorld('fs_api', FS_API);
contextBridge.exposeInMainWorld('process_api', PROCESS_API);
contextBridge.exposeInMainWorld('electron_api', ELECTRON_API);
