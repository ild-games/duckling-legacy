import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef
} from '@angular/core';

import {immutableAssign, DialogService, PathService} from '../util';
import {ProjectService} from './project.service';

/**
 * Component for loading asset files.
 */
@Component({
    selector: "dk-browse-asset",
    styleUrls: ['./duckling/project/browse-asset.component.css'],
    template:`
        <div class="wrapper">
            <button
                md-raised-button
                disableRipple="true"
                [title]="buttonText"
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
export class BrowseAssetComponent {
    @Input()
    buttonText : string = "Browse";

    @Input()
    dialogOptions : any = {};

    @Input()
    selectedFile = "";

    @Output()
    filePicked = new EventEmitter<string>();

    constructor(private _path : PathService,
                private _project : ProjectService,
                private _dialog : DialogService) {
    }

    onBrowseClicked() {
        this.dialogOptions.properties.push('noResolveAliases');
        this._dialog.showOpenDialog(
            this.dialogOptions,
            (fileNames : string[]) => {
                if (fileNames && fileNames[0]) {
                    this.onFilePicked(fileNames[0])
                }
            });
    }

    onFilePicked(file : string) {
        if (!file) {
            return;
        }
        file = this._path.normalize(file);

        let resourceDirectory = this._path.join(this._project.home, 'resources');
        if (!this._path.isSubOfDir(file, resourceDirectory)) {
            this._dialog.showErrorDialog(
                "Unable to load asset",
                "You must select assets from the resources/ folder in the root of your project");
            return;
        }

        this.filePicked.emit(this._path.toKey(resourceDirectory, file));
    }

    get fileName() : string {
        if (this.selectedFile) {
            return this.selectedFile;
        } else {
            return "No file selected";
        }
    }
}
