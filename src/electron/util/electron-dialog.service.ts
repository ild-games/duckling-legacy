import { Injectable, NgZone } from "@angular/core";
import { dialog, getCurrentWindow } from "@electron/remote";

import { DialogService } from "../../duckling/util/dialog.service";

/**
 * Service to use open, save, and error dialog boxes for Electron.
 */
@Injectable()
export class ElectronDialogService implements DialogService {
    private _dialog: Electron.Dialog;

    constructor(protected _zone: NgZone) {
        this._dialog = dialog;
    }

    showOpenDialog(options: any, callback?: (fileNames: string[]) => void) {
        this._zone.runOutsideAngular(async () => {
            const {filePaths, canceled} = await this._dialog.showOpenDialog(
                getCurrentWindow(),
                options
            );
            if (callback && !canceled) {
                this._zone.run(() => callback(filePaths));
            }
        });
    }

    showErrorDialog(title: string, content: string) {
        this._zone.runOutsideAngular(() => {
            this._dialog.showErrorBox(title, content);
        });
    }
}
