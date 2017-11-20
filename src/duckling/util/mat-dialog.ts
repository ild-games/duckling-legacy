import {Component, ViewContainerRef, ElementRef} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs';

/**
 * Removes the padding for the mat-dialog that the given view container is in
 * @param  viewContainer ViewContainer that is contained within the mat-dialog
 */
export function removePadding(viewContainer : ViewContainerRef) {
    let matDialog = findDialogContainer(viewContainer.element.nativeElement);
    if (matDialog) {
        matDialog.style.padding = "0";
    }
}

function findDialogContainer(element : HTMLElement) {
    while (element) {
        if (isMatDialogContainer(element)) {
             return element;
        }
        element = element.parentElement
    }
    return null;
}

function isMatDialogContainer(element : HTMLElement) : boolean {
    return element.classList.contains('mat-dialog-container');
}
