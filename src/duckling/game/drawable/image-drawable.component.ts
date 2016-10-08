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
import {immutableAssign, DialogService} from '../../util';
import {Box2} from '../../math';
import {AssetService, ProjectService} from '../../project';

import {ImageDrawable} from './image-drawable';
/**
 * Component used to edit an ImageDrawable
 */
@Component({
    selector: "dk-image-drawable",
    template: `
        <dk-browse-asset
            [dialogOptions]="dialogOptions"
            [selectedFile]="imageDrawable.textureKey"
            (filePicked)="onImageFilePicked($event)">
        </dk-browse-asset>

        <dk-section
            headerText="Partial Image?"
            checkboxMode="true"
            collapsible="true"
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
        </dk-section>
    `
})
export class ImageDrawableComponent {
    @Input() imageDrawable : ImageDrawable;
    @Output() drawableChanged = new EventEmitter<ImageDrawable>();

    constructor(private _dialog : DialogService,
                private _assets : AssetService,
                private _project : ProjectService) {
    }

    onImageFilePicked(imageKey : string) {
        this._assets.add({type: "TexturePNG", key: imageKey});
        this.drawableChanged.emit(immutableAssign(this.imageDrawable, {textureKey: imageKey}));
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
            defaultPath: this._project.home,
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
        let texture = this._assets.get(this.imageDrawable.textureKey, "TexturePNG");
        if (!texture) {
            return new Rectangle(0, 0, 0, 0);
        }
        return texture.frame;
    }
}
