import {Component, ViewContainerRef} from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs';

/**
 * Opens the angular-material dialog and returns an observable for the result.
 * @param  viewContainer ViewContainer that will be used to bootstrap the dialog.
 * @param  dialogClass   Class of the dialog to open.
 * @return An observable for the dialog's result.
 */
export function openDialog<R>(viewContainer : ViewContainerRef, dialogClass : any) : Observable<R> {
        let config = new MdDialogConfig();
        let mDialog = viewContainer.injector.get(MdDialog);
        config.viewContainerRef = viewContainer;
        let dialog = mDialog.open(dialogClass, config);
        return dialog.afterClosed();
}
