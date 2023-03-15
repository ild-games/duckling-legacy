import { Injectable, NgZone } from '@angular/core';

import { DialogService } from '../../duckling/util/dialog.service';

/**
 * Service to use open, save, and error dialog boxes for Electron.
 */
@Injectable()
export class ElectronDialogService implements DialogService {
  private _dialog: typeof electron_api.dialog;

  constructor(protected _zone: NgZone) {
    this._dialog = electron_api.dialog;
  }

  showOpenDialog(options: any, callback?: (fileNames: string[]) => void) {
    this._zone.runOutsideAngular(async () => {
      const { filePaths, canceled } = await this._dialog.showOpenDialog(
        electron_api.getCurrentWindow(),
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
