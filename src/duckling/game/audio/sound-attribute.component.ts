import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import { Vector } from '../../math/vector';

import {FormLabelComponent, InputComponent, NumberInputComponent, Box2Component, CheckboxComponent, Validator} from '../../controls';
import {immutableAssign, immutableArrayAssign} from '../../util/model';
import {DialogService} from '../../util/dialog.service';
import {AssetService, Asset} from '../../project/asset.service';
import {ProjectService} from '../../project/project.service';

import { SoundAttribute } from './sound-attribute';
import { defaultSound, Sound } from './sound';

@Component({
    selector: "dk-sound-attribute",
    styleUrls: ['./duckling/game/audio/sound-attribute.component.css'],
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
                    <dk-sound
                        [sound]="element"
                        (soundChanged)="onSoundChanged($event,index)">
                    </dk-sound>
                </ng-template>
            </dk-accordion>
        </md-card>
    `
})
export class SoundAttributeComponent {
    @Input() attribute: SoundAttribute;
    @Output() attributeChanged = new EventEmitter<SoundAttribute>();

    constructor(private _dialog : DialogService,
                private _assets : AssetService,
                private _project : ProjectService) {
    }

    onAddSoundClicked(fileChosen: string) {
        this._assets.add([{asset: {key: fileChosen, type: "SoundWAV"}}]);
        let newSound = immutableAssign(defaultSound, {soundKey: fileChosen})
        this.attributeChanged.emit(immutableAssign(this.attribute, {sounds: this.attribute.sounds.concat(newSound)}));
    }

    onSoundChanged(event: Sound, index: number) {
        let newSounds : Sound[] = [];
        newSounds[index] = immutableAssign(this.attribute.sounds[index], event);
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