import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    ViewContainerRef
} from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';

export type AutoCreateDialogResult = {
    x: number,
    y: number,
    imageKey: string,
}

@Component({
    selector: 'dk-auto-create-animation-dialog',
    template: `
        <button
            md-raised-button
            type="button"
            (click)="onAcceptClicked()">
            Accept
        </button>
        <button
            md-raised-button
            type="button"
            (click)="onCancelClicked()">
            Cancel
        </button>
    `
})
export class AutoCreateAnimationDialogComponent {
    constructor(private _dialogRef : MdDialogRef<AutoCreateAnimationDialogComponent>) {
    }

    onAcceptClicked() {
        let result : AutoCreateDialogResult = {
            x: 50,
            y: 50,
            imageKey: "Hello"
        };
        this._dialogRef.close(result);
    }

    onCancelClicked() {
        this._dialogRef.close(null);
    }
}
