import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";

interface SnackBar {
  message: string;
  action: string;
}

/**
 * Service used to display snackbars one after the other
 */
@Injectable()
export class SnackBarService {
  private _snacks: SnackBar[] = [];

  constructor(private _snackbar?: MatSnackBar) {}

  /**
   * @brief Invoke all the current snackbars, first one put in is the first one displayed
   */
  invokeSnacks() {
    if (this._snacks.length === 0) {
      return;
    }

    let nextSnack = this._snacks.shift();
    if (this._snackbar) {
      let ref = this._snackbar.open(nextSnack.message, nextSnack.action);
      ref.afterDismissed().subscribe(() => this.invokeSnacks());
    }
  }

  /**
   * @brief Adds a new snackbar to the service
   *
   * @param message The message displayed to the user
   * @param actionText (optional) The text on the button the user clicks to dismiss the snackbar. Default is 'OK'
   */
  addSnack(message: string, actionText?: string) {
    actionText = actionText || "OK";
    this._snacks.push({
      message: message,
      action: actionText
    });
  }
}
