import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    ChangeDetectorRef
} from '@angular/core';
import {Rectangle} from 'pixi.js';

import {FormLabelComponent, InputComponent, NumberInputComponent, Box2Component, CheckboxComponent, Validator} from '../../controls';
import {immutableAssign, DialogService, PathService} from '../../util';
import {Box2} from '../../math';
import {ProjectService, AssetService} from '../../project';

import {ImageDrawable} from './image-drawable';
/**
 * Component used to edit an ImageDrawable
 */
@Component({
    selector: "dk-image-drawable",
    template: `
        <dk-browse-file
            [dialogOptions]="dialogOptions"
            [selectedFile]="imageDrawable.textureKey"
            (filePicked)="onImageFilePicked($event)">
        </dk-browse-file>

        <dk-collapsible-section
            headerText="Partial Image?"
            [sectionOpen]="!imageDrawable.isWholeImage"
            (sectionOpenChanged)="onPartialImageChanged($event)">
            <dk-box2
                [value]="imageDrawable.textureRect"
                [xValidator]="partialXValidator"
                [yValidator]="partialYValidator"
                [widthValidator]="partialWidthValidator"
                [heightValidator]="partialHeightValidator"
                (boxChanged)="onTextureRectChanged($event)">
            </dk-box2>
        </dk-collapsible-section>
    `
})
export class ImageDrawableComponent {
    @Input() imageDrawable : ImageDrawable;
    @Output() drawableChanged = new EventEmitter<ImageDrawable>();

    constructor(private _dialog : DialogService,
                private _path : PathService,
                private _assets : AssetService,
                private _project : ProjectService) {
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

    isPartialXValid(value : string) : boolean {
        return parseInt(value) + this.imageDrawable.textureRect.dimension.x <= this._assetDimensions.width;
    }

    isPartialYValid(value : string) : boolean {
        return parseInt(value) + this.imageDrawable.textureRect.dimension.y <= this._assetDimensions.height;
    }

    isPartialWidthValid(value : string) : boolean {
        return parseInt(value) + this.imageDrawable.textureRect.position.x <= this._assetDimensions.width;
    }

    isPartialHeightValid(value : string) : boolean {
        return parseInt(value) + this.imageDrawable.textureRect.position.y <= this._assetDimensions.height;
    }

    get dialogOptions() {
        return {
            defaultPath: this._project.project.home,
            properties: [
                'openFile'
            ],
            filters: [
                {name: 'Images', extensions: ['png']},
            ]
        }
    }

    get partialXValidator() : Validator {
        return (value : string) => this.isPartialXValid(value);
    }

    get partialYValidator() : Validator {
        return (value : string) => this.isPartialYValid(value);
    }

    get partialWidthValidator() : Validator {
        return (value : string) => this.isPartialWidthValid(value);
    }

    get partialHeightValidator() : Validator {
        return (value : string) => this.isPartialHeightValid(value);
    }

    get _assetDimensions() : Rectangle {
        let texture = this._assets.get(this.imageDrawable.textureKey);
        if (!texture) {
            return new Rectangle(0, 0, 0, 0);
        }
        return texture.frame;
    }
}
