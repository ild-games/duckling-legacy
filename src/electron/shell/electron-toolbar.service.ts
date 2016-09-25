import {Injectable} from "@angular/core";
import {remote, Menu, MenuItem} from "electron";
import * as _ from "lodash";

import {FileToolbarAction, FileToolbarService} from "../../duckling/shell/file-toolbar.service";

/**
 * Electron implementation of the FileToolbarService used to handle the menu at the top of the
 * window.
 */
@Injectable()
export class ElectronToolbarService extends FileToolbarService {
    constructor() {
        super();

        this.addAction({
            menuPath : ["File"],
            label : "Close Project",
            shortcut: "CmdOrCtrl+R",
            callback : () => remote.getCurrentWindow().reload()
        });
    }

    bootstrapMenu() {
        remote.Menu.setApplicationMenu(this.toMenu(this.actions));
    }

    toMenu(actions : FileToolbarAction []) {
        let menu = new remote.Menu();

        let [subMenuActions, items] = _.partition(actions, action => action.menuPath.length);
        let subMenus = _.groupBy(subMenuActions, action => action.menuPath[0]);

        for (let menuName in subMenus) {
            menu.append(new remote.MenuItem({
                label : menuName,
                submenu : this.toMenu(this.popMenuLevel(subMenus[menuName]))
            }));
        }

        for (let item of items) {
            menu.append(this.toMenuItem(item));
        }

        return menu;
    }

    toMenuItem(action : FileToolbarAction) {
        return new remote.MenuItem({
            click : action.callback,
            type : "normal",
            label : action.label,
            accelerator : action.shortcut,
        });
    }

    popMenuLevel(actions : FileToolbarAction []) {
        return _.map(actions, (action) => {
            return {
                menuPath : action.menuPath.slice(1),
                label : action.label,
                shortcut : action.shortcut,
                callback : action.callback
            }
        });
    }
}
