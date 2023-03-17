import { Injectable, NgZone } from '@angular/core';

import { DialogService } from '../../duckling/util/dialog.service';

/**
 * Service to use open, save, and error dialog boxes for Electron.
 */
@Injectable()
export class ElectronDialogService implements DialogService {
  constructor(protected _zone: NgZone) {}

  showOpenDialog(
    options: any,
    callback?: (o: Electron.OpenDialogReturnValue) => void
  ) {
    electron_api.dialog.showOpen(options).then(callback);
  }

  showErrorDialog(title: string, content: string) {
    electron_api.dialog.showError(title, content);
  }
}
