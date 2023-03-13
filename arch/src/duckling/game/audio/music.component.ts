import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatSliderChange } from "@angular/material/slider";

import { immutableAssign } from "../../util/model";

import { Music } from "./music";
import { AssetService, Asset } from "../../project/asset.service";
import { ProjectService } from "../../project/project.service";

@Component({
    selector: "dk-music",
    styleUrls: ["./duckling/game/audio/music.component.css"],
    template: `
        <div class="topRow">
            Volume
            <mat-slider
                label="Volume"
                min="0"
                max="100"
                [value]="displayVolume(music.volume)"
                (change)="onSliderChanged($event)">
            </mat-slider>
            {{displayVolume(music.volume)}}
            <dk-icon-button
                tooltip="Play Music"
                color="accent"
                icon="play"
                [disabled]="music.musicKey === ''"
                [isRaised]="true"
                (iconClick)="onPlayMusic(index)">
            </dk-icon-button>
        </div>
        <dk-browse-asset
            [dialogOptions]="dialogOptions"
            [selectedFile]="music.musicKey"
            (filePicked)="onMusicFilePicked($event)">
        </dk-browse-asset>
        <mat-checkbox
            [checked]="music.loop"
            (change)="onLoopPressed($event.checked)">
            Loop?
        </mat-checkbox>
        <dk-number-input
            label="Second to start loop on"
            [value]="music.loopStart"
            (validInput)="onLoopStartChanged($event)">
        </dk-number-input>
    `,
})
export class MusicComponent {
    @Input() music: Music;
    @Output() musicChanged = new EventEmitter<Music>();

    constructor(
        private _assets: AssetService,
        private _project: ProjectService
    ) {}

    displayVolume(volume: number) {
        return Math.round(volume * 100);
    }

    onLoopPressed(newLoop: boolean) {
        this.musicChanged.emit(immutableAssign(this.music, { loop: newLoop }));
    }

    onLoopStartChanged(newLoopStart: number) {
        this.musicChanged.emit(
            immutableAssign(this.music, { loopStart: newLoopStart })
        );
    }

    onSliderChanged(event: MatSliderChange) {
        this.musicChanged.emit(
            immutableAssign(this.music, { volume: event.value / 100 })
        );
    }

    onPlayMusic(index: number) {
        let asset: Asset = {
            type: "MusicOGG",
            key: this.music.musicKey,
        };
        let music = this._assets.get(asset);
        if (!music) {
            music = this._assets.get(
                { type: "SoundWAV", key: "sound-not-found" },
                true
            );
        } else {
            music.volume(this.music.volume);
        }

        music.stop();
        music.play();
    }

    onMusicFilePicked(fileChosen: string) {
        this._assets.add([{ asset: { key: fileChosen, type: "MusicOGG" } }]);
        this.musicChanged.emit(
            immutableAssign(this.music, { musicKey: fileChosen })
        );
    }

    get dialogOptions() {
        return {
            properties: ["openFile"],
            filters: [{ name: "MusicFiles", extensions: ["ogg"] }],
        };
    }
}
