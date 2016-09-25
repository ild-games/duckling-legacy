import {Injectable} from '@angular/core';

/**
 * Describes an action that is available from the file menus at the top of duckling.
 */
export interface FileToolbarAction {
    menuPath : string [],
    label : string,
    shortcut? : string,
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
