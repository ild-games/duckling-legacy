import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { MdSliderModule, MdSliderChange} from '@angular/material';

import { Vector } from '../../math/vector';

import {FormLabelComponent, InputComponent, NumberInputComponent, Box2Component, CheckboxComponent, Validator} from '../../controls';
import {immutableAssign, immutableArrayAssign} from '../../util/model';
import {DialogService} from '../../util/dialog.service';
import {AssetService, ProjectService} from '../../project';

import { AudioAttribute } from './audio-attribute';
import { defaultSound, Sound } from './sound';

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
        let newSound = immutableAssign(defaultSound, {soundKey: fileChosen})
        this.attributeChanged.emit(immutableAssign(this.attribute, {sounds: this.attribute.sounds.concat(newSound)}));
    }

    public onSliderChanged(event: MdSliderChange, index: number) {
        let newSounds : Sound[] = [];
        newSounds[index] = immutableAssign(this.attribute.sounds[index], {volume : event.value});
        let soundsPatch = immutableArrayAssign(this.attribute.sounds, newSounds);
        this.attributeChanged.emit(immutableAssign(this.attribute, {sounds: soundsPatch}));
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