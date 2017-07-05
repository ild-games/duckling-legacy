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
import {AssetService, Asset} from '../../project/asset.service';
import {ProjectService} from '../../project/project.service';

import { AudioAttribute } from './audio-attribute';
import { defaultSound, Sound } from './sound';

@Component({
    selector: "dk-audio",
    styleUrls: ['./duckling/game/audio/audio.component.css'],
    template: `
        <dk-browse-asset
            [dialogOptions]="dialogOptions"
            (filePicked)="onAddSoundClicked($event)">
        </dk-browse-asset>
        <md-card class="sounds-card">
            <dk-accordion
                [elements]="attribute.sounds"
                titleProperty="soundKey">
                <ng-template let-element="$element" let-index="$index">
                    <md-slider
                        label="Volume"
                        min="0"
                        max="100"
                        [value]="displayVolume(element.volume)"
                        (change)="onSliderChanged($event, index)">
                    </md-slider>
                    {{displayVolume(element.volume)}}
                    <md-checkbox
                        [checked]="element.loopSound">
                        Loop Sound?
                    </md-checkbox>
                    <dk-icon-button
                        tooltip="Play Sound"
                        color="accent"
                        icon="play"
                        [isRaised]="true"
                        (iconClick)="onPlaySound(index)">
                    </dk-icon-button>
                </ng-template>
            </dk-accordion>
        </md-card>
    `
})
export class AudioComponent {
    @Input() attribute: AudioAttribute;
    @Output() attributeChanged = new EventEmitter<AudioAttribute>();

    constructor(private _dialog : DialogService,
                private _assets : AssetService,
                private _project : ProjectService) {
    }

    onAddSoundClicked(fileChosen: string) {
        this._assets.add([{asset: {key: fileChosen, type: "SoundWAV"}}]);
        let newSound = immutableAssign(defaultSound, {soundKey: fileChosen})
        this.attributeChanged.emit(immutableAssign(this.attribute, {sounds: this.attribute.sounds.concat(newSound)}));
    }

    onSliderChanged(event: MdSliderChange, index: number) {
        let newSounds : Sound[] = [];
        newSounds[index] = immutableAssign(this.attribute.sounds[index], {volume : event.value / 100});
        let soundsPatch = immutableArrayAssign(this.attribute.sounds, newSounds);
        this.attributeChanged.emit(immutableAssign(this.attribute, {sounds: soundsPatch}));
    }

    onPlaySound(index : number) {
        let asset : Asset = {
            type: "SoundWAV",
            key: this.attribute.sounds[index].soundKey
        }
        let sound = this._assets.get(asset);
        if (!sound) {
            sound = this._assets.get({type: "SoundWAV", key: "audio-not-found"}, true);
        } else {
            sound.volume(this.attribute.sounds[index].volume);
        }

        sound.stop();
        sound.play();
    }

    displayVolume(volume : number) {
        return Math.round(volume * 100);
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