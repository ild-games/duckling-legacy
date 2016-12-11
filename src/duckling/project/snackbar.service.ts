import {Injectable} from '@angular/core';
import {MdSnackBar} from '@angular/material';

export interface SnackBar {
    message: string,
    action: string
}

/**
 * Service used to display snackbars one after the other
 */
@Injectable()
export class SnackBarService {
    private _snacks : SnackBar[] = [];

    constructor(private _snackbar : MdSnackBar) {
    }

    /**
     * Invoke all the current snackbars, first one put in is the first one displayed
     */
    invokeSnacks() {
        if (this._snacks.length > 0) {
            let ref = this._snackbar.open(this._snacks[0].message, this._snacks[0].action);
            this._snacks = this._snacks.slice(1);
            ref.afterDismissed().subscribe(() => this.invokeSnacks());
        }
    }

    /**
     * Adds a new snackbar to the service
     */
    addSnack(snack : SnackBar) {
        this._snacks.push(snack);
    }
}