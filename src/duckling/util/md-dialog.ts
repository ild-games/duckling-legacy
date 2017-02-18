import {Component, ViewContainerRef, ElementRef} from '@angular/core';
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

/**
 * Removes the padding for the md-dialog that the given view container is in
 * @param  viewContainer ViewContainer that is contained within the md-dialog
 */
export function removePadding(viewContainer : ViewContainerRef) {
    let mdDialog = findDialogContainer(viewContainer.element.nativeElement);
    if (mdDialog) {
        mdDialog.style.padding = "0";
    }
}

function findDialogContainer(element : HTMLElement) {
    while (element) {
        if (isMdDialogContainer(element)) {
             return element;
        }
        element = element.parentElement
    }
    return null;
}

function isMdDialogContainer(element : HTMLElement) : boolean {
    return element.classList.contains('mat-dialog-container');
}