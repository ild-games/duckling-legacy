import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Rectangle } from "pixi.js";

import {
    FormLabelComponent,
    InputComponent,
    NumberInputComponent,
    Box2Component,
    CheckboxComponent,
    Validator,
} from "../../controls";
import { immutableAssign, DialogService } from "../../util";
import { Box2 } from "../../math";
import { Vector } from "../../math/vector";
import { AssetService, ProjectService } from "../../project";
import { PathService } from "../../util/path.service";

import { ImageDrawable } from "./image-drawable";

@Component({
    selector: "dk-image-drawable",
    template: `
        <dk-browse-asset
            [dialogOptions]="dialogOptions"
            [selectedFile]="imageDrawable.textureKey"
            (filePicked)="onImageFilePicked($event)">
        </dk-browse-asset>

        <dk-section
            headerText="Tiled Image?"
            checkboxMode="true"
            collapsible="true"
            [sectionOpen]="imageDrawable.isTiled"
            (sectionOpenChanged)="onTiledChanged($event)">
            <dk-vector-input
                title="Tiled Area"
                xLabel="Tiled Area Width"
                yLabel="Tiled Area Height"
                [value]="imageDrawable.tiledArea"
                (validInput)="onTiledAreaChanged($event)">
            </dk-vector-input>
        </dk-section>

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
    `,
})
export class ImageDrawableComponent {
    @Input() imageDrawable: ImageDrawable;
    @Output() drawableChanged = new EventEmitter<ImageDrawable>();

    constructor(
        private _dialog: DialogService,
        private _assets: AssetService,
        private _project: ProjectService,
        private _path: PathService
    ) {}

    onImageFilePicked(imageKey: string) {
        this._assets.add([{ asset: { type: "TexturePNG", key: imageKey } }]);
        this.drawableChanged.emit(
            immutableAssign(this.imageDrawable, { textureKey: imageKey })
        );
    }

    onTiledChanged(newIsTiled: boolean) {
        this.drawableChanged.emit(
            immutableAssign(this.imageDrawable, { isTiled: newIsTiled })
        );
    }

    onTiledAreaChanged(newTiledArea: Vector) {
        this.drawableChanged.emit(
            immutableAssign(this.imageDrawable, { tiledArea: newTiledArea })
        );
    }

    onPartialImageChanged(partialImage: boolean) {
        this.drawableChanged.emit(
            immutableAssign(this.imageDrawable, { isWholeImage: !partialImage })
        );
    }

    onTextureRectChanged(newTextureRect: Box2) {
        this.drawableChanged.emit(
            immutableAssign(this.imageDrawable, { textureRect: newTextureRect })
        );
    }

    isPartialXValid(value: string): boolean {
        return (
            parseInt(value) + this.imageDrawable.textureRect.dimension.x <=
            this._assetDimensions.width
        );
    }

    isPartialYValid(value: string): boolean {
        return (
            parseInt(value) + this.imageDrawable.textureRect.dimension.y <=
            this._assetDimensions.height
        );
    }

    isPartialWidthValid(value: string): boolean {
        return (
            parseInt(value) + this.imageDrawable.textureRect.position.x <=
            this._assetDimensions.width
        );
    }

    isPartialHeightValid(value: string): boolean {
        return (
            parseInt(value) + this.imageDrawable.textureRect.position.y <=
            this._assetDimensions.height
        );
    }

    get dialogOptions() {
        return {
            properties: ["openFile"],
            filters: [{ name: "Images", extensions: ["png"] }],
        };
    }

    get partialXValidator(): Validator {
        return (value: string) => this.isPartialXValid(value);
    }

    get partialYValidator(): Validator {
        return (value: string) => this.isPartialYValid(value);
    }

    get partialWidthValidator(): Validator {
        return (value: string) => this.isPartialWidthValid(value);
    }

    get partialHeightValidator(): Validator {
        return (value: string) => this.isPartialHeightValid(value);
    }

    get _assetDimensions(): Rectangle {
        let texture = this._assets.get({
            key: this.imageDrawable.textureKey,
            type: "TexturePNG",
        });
        if (!texture) {
            return new Rectangle(0, 0, 0, 0);
        }
        return texture.frame;
    }
}
