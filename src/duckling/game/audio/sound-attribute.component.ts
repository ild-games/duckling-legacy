import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Vector } from '../../math/vector';

import {
  FormLabelComponent,
  InputComponent,
  NumberInputComponent,
  Box2Component,
  CheckboxComponent,
  Validator,
} from '../../controls';
import { immutableAssign, immutableArrayAssign } from '../../util/model';
import { DialogService } from '../../util/dialog.service';
import { AssetService, Asset } from '../../project/asset.service';
import { ProjectService } from '../../project/project.service';

import { SoundAttribute } from './sound-attribute';
import { defaultSound, Sound } from './sound';

@Component({
  selector: 'dk-sound-attribute',
  styleUrls: ['./sound-attribute.component.scss'],
  template: `
    <dk-button
      tooltip="Add new sound"
      text="Add Sound"
      icon="plus"
      (click)="onAddSoundClicked()"
    >
    </dk-button>
    <mat-card class="sounds-card">
      <dk-accordion
        [elements]="attribute.sounds"
        titleProperty="soundKey"
        defaultTitle="<new sound>"
        (elementDeleted)="onSoundsChanged($event)"
        (elementMovedDown)="onSoundsChanged($event)"
        (elementMovedUp)="onSoundsChanged($event)"
      >
        <ng-template let-element="$element" let-index="$index">
          <dk-sound
            [sound]="element"
            (soundChanged)="onSoundChanged($event, index)"
          >
          </dk-sound>
        </ng-template>
      </dk-accordion>
    </mat-card>
  `,
})
export class SoundAttributeComponent {
  @Input() attribute: SoundAttribute;
  @Output() attributeChanged = new EventEmitter<SoundAttribute>();

  constructor(
    private _dialog: DialogService,
    private _assets: AssetService,
    private _project: ProjectService
  ) {}

  onAddSoundClicked() {
    let newSound = immutableAssign(defaultSound, {});
    this.attributeChanged.emit(
      immutableAssign(this.attribute, {
        sounds: this.attribute.sounds.concat(newSound),
      })
    );
  }

  onSoundChanged(event: Sound, index: number) {
    let newSounds: Sound[] = [];
    newSounds[index] = immutableAssign(this.attribute.sounds[index], event);
    let soundsPatch = immutableArrayAssign(this.attribute.sounds, newSounds);
    this.attributeChanged.emit(
      immutableAssign(this.attribute, { sounds: soundsPatch })
    );
  }

  onSoundsChanged(newSounds: readonly Sound[]) {
    this.attributeChanged.emit(
      immutableAssign(this.attribute, { sounds: newSounds })
    );
  }
}
