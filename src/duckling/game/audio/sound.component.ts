import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { MatSliderModule, MatSliderChange } from '@angular/material';

import {immutableAssign, immutableArrayAssign} from '../../util/model';

import { Sound } from './sound';
import { AssetService, Asset } from '../../project/asset.service';
import { ProjectService } from '../../project/project.service';

@Component({
    selector: "dk-sound",
    styleUrls: ['./duckling/game/audio/sound.component.css'],
    template: `
        <div class="topRow">
            Volume
            <mat-slider
                label="Volume"
                min="0"
                max="100" 
                [value]="displayVolume(sound.volume)"
                (change)="onSliderChanged($event)">
            </mat-slider>
            {{displayVolume(sound.volume)}}
            <dk-icon-button
                tooltip="Play Sound"
                color="accent"
                icon="play"
                [disabled]="sound.soundKey === ''"
                [isRaised]="true"
                (iconClick)="onPlaySound(index)">
            </dk-icon-button>
        </div>
        <dk-browse-asset
            [dialogOptions]="dialogOptions"
            [selectedFile]="sound.soundKey"
            (filePicked)="onSoundFilePicked($event)">
        </dk-browse-asset>
    `
})
export class SoundComponent {
    @Input() sound: Sound;
    @Output() soundChanged = new EventEmitter<Sound>();

    constructor(private _assets: AssetService,
                private _project: ProjectService) {
    }

    displayVolume(volume: number) {
        return Math.round(volume * 100);
    }

    onSliderChanged(event: MatSliderChange) {
        this.soundChanged.emit(immutableAssign(this.sound, { volume: event.value / 100 }));
    }

    onPlaySound(index: number) {
        let asset: Asset = {
            type: "SoundWAV",
            key: this.sound.soundKey
        }
        let sound = this._assets.get(asset);
        if (!sound) {
            sound = this._assets.get({ type: "SoundWAV", key: "sound-not-found" }, true);
        } else {
            sound.volume(this.sound.volume);
        }

        sound.stop();
        sound.play();
    }

    onSoundFilePicked(fileChosen: string) {
        this._assets.add([{asset: { key: fileChosen, type: "SoundWAV" }}]);
        this.soundChanged.emit(immutableAssign(this.sound, { soundKey: fileChosen }));
    }

    get dialogOptions() {
        return {
            properties: [
                'openFile'
            ],
            filters: [
                {name: 'SoundFiles', extensions: ['wav']},
            ]
        }
    }
}
