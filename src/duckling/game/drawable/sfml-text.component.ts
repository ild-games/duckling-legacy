import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit
} from '@angular/core';

import {immutableAssign} from '../../util/model';
import {Color} from '../../canvas/drawing/color';
import {ProjectService} from '../../project/project.service';
import {AssetService} from '../../project/asset.service';

import {SFMLText} from './sfml-text';

@Component({
    selector: "dk-sfml-text",
    template: `
        <dk-input
            label="Text"
            [value]="sfmlText.text"
            (inputChanged)="onTextChanged($event)">
        </dk-input>
        <dk-browse-asset
            [dialogOptions]="dialogOptions"
            [selectedFile]="sfmlText.fontKey"
            (filePicked)="onFontFilePicked($event)">
        </dk-browse-asset>
        <dk-number-input
            label="Character Size (px)"
            [value]="sfmlText.characterSize"
            (validInput)="onCharacterSizeChanged($event)">
        </dk-number-input>
        <dk-color
            [color]="sfmlText.color"
            (colorChanged)="onColorChanged($event)">
        </dk-color>
    `
})
export class SFMLTextComponent {
    @Input() sfmlText : SFMLText;

    @Output() sfmlTextChanged = new EventEmitter<SFMLText>();

    constructor(private _project : ProjectService,
                private _assets : AssetService) {
    }

    onTextChanged(newText : string) {
        this.sfmlTextChanged.emit(immutableAssign(this.sfmlText, {text: newText}));
    }

    onFontFilePicked(newFontKey : string) {
        this._assets.add({type: "FontTTF", key: newFontKey});
        this.sfmlTextChanged.emit(immutableAssign(this.sfmlText, {fontKey: newFontKey}));
    }

    onCharacterSizeChanged(newCharacterSize : number) {
        this.sfmlTextChanged.emit(immutableAssign(this.sfmlText, {characterSize: newCharacterSize}));
    }

    onColorChanged(newColor : Color) {
        this.sfmlTextChanged.emit(immutableAssign(this.sfmlText, {color: newColor}));
    }

    get dialogOptions() {
        return {
            defaultPath: this._project.project.home,
            properties: [
                'openFile'
            ],
            filters: [
                {name: 'Fonts', extensions: ['ttf']},
            ]
        }
    }
}
