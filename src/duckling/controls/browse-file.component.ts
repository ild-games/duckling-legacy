import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef
} from '@angular/core';

import {immutableAssign, DialogService} from '../util';

/**
 * Component for displaying and editing a Color object
 */
@Component({
    selector: "dk-browse-file-component",
    styleUrls: ['./duckling/controls/browse-file.component.css'],
    template:`
        <div class="wrapper">
            <button
                md-raised-button
                [title]="buttonText"
                [disableRipple]=true
                (click)="onBrowseClicked()">
                {{buttonText}}
            </button>
            <dk-input
                disabled="true"
                placeholder="File"
                [value]="fileName">
            </dk-input>
        </div>
    `
})
export class BrowseFileComponent {
    @Input()
    buttonText : string = "Browse";

    @Input()
    dialogOptions : {} = {};

    @Input()
    selectedFile = "";

    @Output()
    filePicked = new EventEmitter<string>();

    constructor(private _dialog : DialogService) {
    }

    onBrowseClicked() {
        this._dialog.showOpenDialog(
            this.dialogOptions,
            (fileNames : string[]) => {
                if (fileNames[0]) {
                    this.onFilePicked(fileNames[0])
                }
            });
    }

    onFilePicked(file : string) {
        this.filePicked.emit(file);
    }

    get fileName() : string {
        if (this.selectedFile) {
            return this.selectedFile;
        } else {
            return "No file selected";
        }
    }
}
