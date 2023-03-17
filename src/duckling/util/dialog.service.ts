import { OpenDialogReturnValue } from 'electron';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {
  /**
   * Show an open file dialog box.
   * @param  options  Dialog box options.
   * @param  callback Optional callback function, first parameter is the files selected.
   */
  showOpenDialog(
    options: any,
    callback?: (openDialogReturnValue: OpenDialogReturnValue) => void
  ): void {}

  /**
   * Show an error message.
   * @param  title   Dialog box options.
   * @param  content Optional callback function, first parameter is the files selected.
   */
  showErrorDialog(title: string, content: string) {}
}
