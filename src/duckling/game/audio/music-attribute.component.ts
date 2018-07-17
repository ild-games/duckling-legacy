import { Component, Input, Output, EventEmitter } from "@angular/core";

import { Vector } from "../../math/vector";

import {
  FormLabelComponent,
  InputComponent,
  NumberInputComponent,
  Box2Component,
  CheckboxComponent,
  Validator
} from "../../controls";
import { immutableAssign, immutableArrayAssign } from "../../util/model";
import { DialogService } from "../../util/dialog.service";
import { AssetService, Asset } from "../../project/asset.service";
import { ProjectService } from "../../project/project.service";

import { MusicAttribute } from "./music-attribute";
import { defaultMusic, Music } from "./music";

@Component({
  selector: "dk-music-attribute",
  styleUrls: ["./duckling/game/audio/music-attribute.component.css"],
  template: `
        <dk-button
            tooltip="Add new music"
            text="Add Music"
            icon="plus"
            (click)="onAddMusicClicked()">
        </dk-button>
        <mat-card class="musics-card">
            <dk-accordion
                [elements]="attribute.musics"
                titleProperty="musicKey"
                defaultTitle="<new music>"
                (elementDeleted)="onMusicsChanged($event)"
                (elementMovedDown)="onMusicsChanged($event)"
                (elementMovedUp)="onMusicsChanged($event)">
                <ng-template let-element="$element" let-index="$index">
                    <dk-music
                        [music]="element"
                        (musicChanged)="onMusicChanged($event,index)">
                    </dk-music>
                </ng-template>
            </dk-accordion>
        </mat-card>
    `
})
export class MusicAttributeComponent {
  @Input() attribute: MusicAttribute;
  @Output() attributeChanged = new EventEmitter<MusicAttribute>();

  constructor(
    private _dialog: DialogService,
    private _assets: AssetService,
    private _project: ProjectService
  ) {}

  onAddMusicClicked() {
    let newMusic = immutableAssign(defaultMusic, {});
    this.attributeChanged.emit(
      immutableAssign(this.attribute, {
        musics: this.attribute.musics.concat(newMusic)
      })
    );
  }

  onMusicChanged(event: Music, index: number) {
    let newMusics: Music[] = [];
    newMusics[index] = immutableAssign(this.attribute.musics[index], event);
    let musicsPatch = immutableArrayAssign(this.attribute.musics, newMusics);
    this.attributeChanged.emit(
      immutableAssign(this.attribute, { musics: musicsPatch })
    );
  }

  onMusicsChanged(newMusics: Music[]) {
    this.attributeChanged.emit(
      immutableAssign(this.attribute, { musics: newMusics })
    );
  }
}
