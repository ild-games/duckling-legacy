import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    ChangeDetectorRef
} from '@angular/core';
import {MdButton} from '@angular2-material/button';

import {FormLabel, InputComponent, NumberInput, Box2Component, CheckboxComponent} from '../../controls';
import {immutableAssign, DialogService, PathService} from '../../util';
import {Box2} from '../../math';
import {ProjectService, AssetService} from '../../project';

import {ImageDrawable} from './image-drawable';
/**
 * Component used to edit an ImageDrawable
 */
@Component({
    selector: "dk-image-drawable-component",
    directives: [
        FormLabel,
        MdButton,
        NumberInput,
        InputComponent,
        CheckboxComponent,
        Box2Component
    ],
    styleUrls: ['./duckling/game/drawable/image-drawable.component.css'],
    template: `
        <dk-input
            disabled="true"
            class="texture-key"
            placeholder="Image File"
            [value]="imageDrawable.textureKey ? imageDrawable.textureKey  : 'No file selected'">
        </dk-input>
        <button
            md-raised-button
            title="Browse"
            (click)="onBrowseClicked()">
            Browse
        </button>

        <md-card class="partial-image">
            <div class="header md-elevation-z3">
                <dk-checkbox
                    [checked]="!imageDrawable.isWholeImage"
                    text="Partial Image?"
                    (input)="onPartialImageChanged($event)">
                </dk-checkbox>
            </div>
            <dk-box2-component
                *ngIf="!imageDrawable.isWholeImage"
                class="body"
                [value]="imageDrawable.textureRect"
                (boxChanged)="onTextureRectChanged($event)">
            </dk-box2-component>
        </md-card>
    `
})
export class ImageDrawableComponent {
    @Input() imageDrawable : ImageDrawable;
    @Output() drawableChanged = new EventEmitter<ImageDrawable>();

    private _dialogOptions : {};

    constructor(private _changeDetector : ChangeDetectorRef,
                private _dialog : DialogService,
                private _path : PathService,
                private _assets : AssetService,
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
            (fileNames : string[]) => {
                if (fileNames[0]) {
                    this.onImageFilePicked(fileNames[0])
                }
            });
    }

    onImageFilePicked(file : string) {
        let homeResourceString = this._path.join(this._project.project.home, 'resources');
        if (file.indexOf(homeResourceString) === -1) {
            this._dialog.showErrorDialog(
                "Unable to load image asset",
                "You must select assets from the resources/ folder in the root of your project");
            return;
        }
        let newTextureKey = file.split(homeResourceString + this._path.folderSeparator)[1].replace(/\.[^/.]+$/, "");
        this._assets.add({type: "TexturePNG", key: newTextureKey});
        this.drawableChanged.emit(immutableAssign(this.imageDrawable, {textureKey: newTextureKey}));
    }

    onPartialImageChanged(partialImage : boolean) {
        this.drawableChanged.emit(immutableAssign(this.imageDrawable, {isWholeImage: !partialImage}));
    }

    onTextureRectChanged(newTextureRect : Box2) {
        this.drawableChanged.emit(immutableAssign(this.imageDrawable, {textureRect: newTextureRect}));
    }
}
