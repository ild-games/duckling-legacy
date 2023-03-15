///<reference path="api.d.ts" />
import { contextBridge } from 'electron';
import { getCurrentWindow, dialog, Menu, MenuItem } from '@electron/remote';
import { readFile, writeFile, access, mkdir } from 'fs/promises';
import { posix, sep } from 'path';

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
  readFile,
  writeFile,
  access,
  mkdir,
};

export const ELECTRON_API = {
  getCurrentWindow,
  dialog,
  Menu,
  MenuItem,
};

export const PROCESS_API = {
  home: process.env['HOME'] || process.env['USERPROFILE'],
};

contextBridge.exposeInMainWorld('path_api', PATH_API);
contextBridge.exposeInMainWorld('fs_api', FS_API);
contextBridge.exposeInMainWorld('process_api', PROCESS_API);
contextBridge.exposeInMainWorld('electron_api', ELECTRON_API);
