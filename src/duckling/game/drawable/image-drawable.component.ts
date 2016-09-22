import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    ChangeDetectorRef
} from '@angular/core';

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
    styleUrls: ['./duckling/game/drawable/image-drawable.component.css'],
    template: `
        <dk-browse-file-component
            [dialogOptions]="dialogOptions"
            [selectedFile]="imageDrawable.textureKey"
            (filePicked)="onImageFilePicked($event)">
        </dk-browse-file-component>

        <dk-collapsible-section-component
            headerText="Partial Image?"
            [sectionOpen]="!imageDrawable.isWholeImage"
            (sectionOpenChanged)="onPartialImageChanged($event)">
            <dk-box2-component
                [value]="imageDrawable.textureRect"
                (boxChanged)="onTextureRectChanged($event)">
            </dk-box2-component>
        </dk-collapsible-section-component>
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
}
