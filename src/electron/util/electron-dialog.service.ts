import {Injectable, NgZone} from 'angular2/core';
import {remote} from 'electron';

import {DialogService} from '../../duckling/util/dialog.service';

/**
 * Service to use open, save, and error dialog boxes for Electron.
 */
@Injectable()
export class ElectronDialogService implements DialogService {
    private _dialog : Electron.Dialog;

    constructor(protected _zone : NgZone) {
        this._dialog = remote.require('dialog');
    }

    /**
     * Show an open file dialog box.
     * @param  {Electron.BrowserWindow}     browserWindow Browser window to render the dialog box in.
     * @param  {Electron.OpenDialogOptions} options       Dialog box options.
     * @param  {(string[]) => void}         callback      Optional callback function, first parameter is the files selected.
     */
    showOpenDialog(options: any, callback?: (fileNames: string[]) => void) {
        this._zone.runOutsideAngular(() => {
            this._dialog.showOpenDialog(
                remote.getCurrentWindow(),
                options,
                (fileNames) => {
                    if (callback) {
                        this._zone.run(() => callback(fileNames));
                    }
                })
            });
    }
}
