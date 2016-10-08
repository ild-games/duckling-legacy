import {Injectable} from '@angular/core';

/**
 * Describes an action that is available from the file menus at the top of duckling.
 */
export interface FileToolbarAction {
    /**
     * Describes where the action is located. For example if the File menu had a
     * Project sub menu with the action "Reload", the menuPath would be ["File", "Project"].
     */
    menuPath : string [],
    /**
     * The value the user sees for the action. Example "Save".
     * @type {string}
     */
    label : string,
    /**
     * Shortcut the user can use to execute the action. See https://github.com/electron/electron/blob/master/docs/api/accelerator.md.
     */
    shortcut? : string,
    /**
     * Callback that is executed when the user selects the action.
     */
    callback : () => any
}

/**
 * Service used to populate the file tool bar at the top of the screen.
 */
@Injectable()
export abstract class FileToolbarService {
    protected actions : FileToolbarAction [] = [];

    /**
     * Add an action to the file toolbar. Cannot be called after the bootstrap phase is finished. Services should
     * call it from their constructor.
     * @param  action Action that will be added to the file toolbar.
     */
    addAction(action : FileToolbarAction) {
        this.actions.push(action);
    }

    /**
     * Called by the shell when the menu should initialize itself.
     */
    abstract bootstrapMenu() : any;
}
