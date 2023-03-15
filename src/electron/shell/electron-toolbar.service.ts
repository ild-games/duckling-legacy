import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import {
  FileToolbarAction,
  FileToolbarService,
} from '../../duckling/shell/file-toolbar.service';

/**
 * Electron implementation of the FileToolbarService used to handle the menu at the top of the
 * window.
 */
@Injectable()
export class ElectronToolbarService extends FileToolbarService {
  constructor() {
    super();

    this.addAction({
      menuPath: ['File'],
      label: 'Close Project',
      shortcut: 'CmdOrCtrl+R',
      callback: () => electron_api.getCurrentWindow().reload(),
    });
    this.addAction({
      menuPath: ['Edit'],
      label: 'Copy',
      shortcut: 'CmdOrCtrl+C',
      role: 'copy',
    });
    this.addAction({
      menuPath: ['Edit'],
      label: 'Paste',
      shortcut: 'CmdOrCtrl+V',
      role: 'paste',
    });
  }

  bootstrapMenu() {
    electron_api.Menu.setApplicationMenu(this._toMenu(this.actions));
  }

  private _toMenu(actions: FileToolbarAction[]) {
    function isSubMenu(action: FileToolbarAction) {
      return action.menuPath.length > 0;
    }

    function subMenuName(action: FileToolbarAction) {
      return action.menuPath[0];
    }

    let menu = new electron_api.Menu();

    let [subMenuActions, items] = _.partition(actions, isSubMenu);
    let subMenus = _.groupBy(subMenuActions, subMenuName);

    for (let menuName in subMenus) {
      menu.append(
        new electron_api.MenuItem({
          label: menuName,
          submenu: this._toMenu(this._popMenuLevel(subMenus[menuName])),
        })
      );
    }

    for (let item of items) {
      menu.append(this._toMenuItem(item));
    }

    return menu;
  }

  private _toMenuItem(action: FileToolbarAction) {
    return new electron_api.MenuItem({
      click: action.callback,
      type: 'normal',
      label: action.label,
      accelerator: action.shortcut,
      role: action.role as any,
    });
  }

  private _popMenuLevel(actions: FileToolbarAction[]) {
    return _.map(actions, (action) => {
      return {
        menuPath: action.menuPath.slice(1),
        label: action.label,
        shortcut: action.shortcut,
        callback: action.callback,
        role: action.role,
      };
    });
  }
}
