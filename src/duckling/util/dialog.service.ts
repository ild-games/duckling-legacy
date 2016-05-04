import {Injectable, NgZone} from 'angular2/core';
import {remote} from 'electron';

/**
 * Service to use open, save, and error dialog boxes.
 */
@Injectable()
export class DialogService {
    private dialog : Electron.Dialog;

    constructor(private zone : NgZone) {
        this.dialog = remote.require('dialog');
    }

    /**
     * Show an open file dialog box.
     * @param  {Electron.BrowserWindow}     browserWindow Browser window to render the dialog box in.
     * @param  {Electron.OpenDialogOptions} options       Dialog box options.
     * @param  {(string[]) => void}         callback      Optional callback function, first parameter is the files selected.
     */
    showOpenDialog(browserWindow : Electron.BrowserWindow, options : Electron.OpenDialogOptions, callback?: (fileNames: string[]) => void) {
        this.zone.runOutsideAngular(() => {
            this.dialog.showOpenDialog(
                browserWindow,
                options,
                (fileNames) => {
                    if (callback) {
                        this.zone.run(() => callback(fileNames));
                    }
                })
            });
    }
}
