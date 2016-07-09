import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    ChangeDetectorRef
} from '@angular/core';
import {MdButton} from '@angular2-material/button';

import {FormLabel, InputComponent} from '../../controls';
import {immutableAssign, DialogService, PathService} from '../../util';
import {ProjectService} from '../../project';

import {ImageDrawable} from './image-drawable';
/**
 * Component used to edit an ImageDrawable
 */
@Component({
    selector: "dk-image-drawable-component",
    directives: [
        FormLabel,
        MdButton,
        InputComponent
    ],
    styleUrls: ['./duckling/game/drawable/image-drawable.component.css'],
    template: `
        <div style="width: 100%">
            <dk-input
                disabled="true"
                class="texture-key"
                placeholder="Image File"
                [value]="imageDrawable.textureKey ? imageDrawable.textureKey  : 'No file selected'">
            </dk-input>
        </div>
        <button
            md-raised-button
            title="Browse"
            (click)="onBrowseClicked()">
            Browse
        </button>
    `
})
export class ImageDrawableComponent {
    @Input() imageDrawable : ImageDrawable;
    @Output() drawableChanged = new EventEmitter<ImageDrawable>();

    private _dialogOptions : {};

    constructor(private _changeDetector : ChangeDetectorRef,
                private _dialog : DialogService,
                private _path : PathService,
                private _project : ProjectService) {
        this._dialogOptions = {
            defaultPath: this._project.project.home,
            properties: [
                'openFile'
            ],
            filters: [
                {name: 'Images', extensions: ['png']},
            ]
        }
    }

    onBrowseClicked() {
        this._dialog.showOpenDialog(
            this._dialogOptions,
            (fileNames : string[]) => this.onImageFilePicked(fileNames[0]));
    }

    onImageFilePicked(file : string) {
        let homeResourceString = this._path.join(this._project.project.home, 'resources');
        let newTextureKey = file.split(homeResourceString + this._path.folderSeparator)[1].replace(/\.[^/.]+$/, "");
        this.drawableChanged.emit(immutableAssign(this.imageDrawable, {textureKey: newTextureKey}));
    }
}
