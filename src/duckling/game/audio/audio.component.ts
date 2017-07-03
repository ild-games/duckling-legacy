import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { MdSliderModule, MdSliderChange} from '@angular/material';

import { Vector } from '../../math/vector';

import {FormLabelComponent, InputComponent, NumberInputComponent, Box2Component, CheckboxComponent, Validator} from '../../controls';
import {immutableAssign, DialogService} from '../../util';
import {AssetService, ProjectService} from '../../project';

import { AudioAttribute } from './audio-attribute';
import { defaultSound } from './sound';

@Component({
    selector: "dk-audio",
    template: `
        <dk-browse-asset
            [dialogOptions]="dialogOptions"
            (filePicked)="onAddSoundClicked($event)">
        </dk-browse-asset>
        <dk-accordion
            [elements]="attribute.sounds"
            titleProperty="soundKey">
            <ng-template let-element="$element" let-index="$index">
                <md-slider
                    label="Volume"
                    min="0"
                    max="100"
                    [value]="element.volume"
                    (change)="onSliderChanged($event, index)">
                </md-slider>
                {{element.volume}}
                <md-checkbox
                    [checked]="element.loopSound">
                    Loop Sound?
                </md-checkbox>
                
            </ng-template>
        </dk-accordion>
    `
})
export class AudioComponent {
    @Input() attribute: AudioAttribute;
    @Output() attributeChanged = new EventEmitter<AudioAttribute>();

    constructor(private _dialog : DialogService,
                private _assets : AssetService,
                private _project : ProjectService) {
    }

    public onAddSoundClicked(fileChosen: string) {
        let newSound = immutableAssign(defaultSound, { soundKey: fileChosen})
        this.attribute.sounds.push(newSound);
    }

    public onSliderChanged(event: MdSliderChange, index: number) {
        this.attribute.sounds[index].volume = event.value;
    }

    get dialogOptions() {
        return {
            defaultPath: this._project.home,
            properties: [
                'openFile'
            ],
            filters: [
                {name: 'SoundFiles', extensions: ['wav']},
            ]
        }
    }
}