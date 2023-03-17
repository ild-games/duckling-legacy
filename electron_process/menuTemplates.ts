import { BrowserWindow, MenuItemConstructorOptions, ipcMain } from 'electron';

/*
 * Each function in this file repressents a full menu state
 * There's a lot of bikeshed/abstraction distraction opportunities
 * don't get fancy here plz
 */

export const defaultMenu: MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      {
        type: 'normal',
        label: 'Close Project',
        accelerator: 'CmdOrCtrl+R',
        click: (_mI, win, _e) => win.reload(),
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'copy',
      },
      {
        role: 'paste',
      },
    ],
  },
];

export const splashMenu: MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      {
        type: 'normal',
        label: 'Close Project',
        accelerator: 'CmdOrCtrl+R',
        click: (_menuItem, win, _event) => win.reload(),
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'copy',
      },
      {
        role: 'paste',
      },
      {
        role: 'undo',
      },
      {
        role: 'redo',
      },
    ],
  },
];

export const projectMenu: MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      {
        type: 'normal',
        label: 'Close Project',
        accelerator: 'CmdOrCtrl+R',
        click: (_menuItem, win, _event) => win.reload(),
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'copy',
      },
      {
        role: 'paste',
      },
      {
        role: 'undo',
      },
      {
        role: 'redo',
      },
    ],
  },
  {
    label: 'Project',
    submenu: [
      {
        label: 'Edit Custom Attributes',
        accelerator: 'CmdOrCtrl+Shift+E',
        click: (_mI, win, _e) => {
          win.emit('ild_editCustomAttributes');
        },
      },
      {
        label: 'Run Migrations For All Maps',
        accelerator: 'CmdOrCtrl+Shift+M',
        click: (_mI, win, _e) => {
          win.emit('ild_runMigrations:all_maps');
        },
      },
      {
        label: 'Minify Maps',
        click: (_mI, win, _e) => {
          win.emit('ild_minify_maps');
        },
      },
    ],
  },
];
