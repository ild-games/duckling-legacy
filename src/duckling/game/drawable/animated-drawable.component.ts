import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewContainerRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { immutableAssign, immutableArrayAssign } from '../../util';
import { AssetService } from '../../project/asset.service';
import { Validator } from '../../controls/validated-input.component';

import { AnimatedDrawable } from './animated-drawable';
import { ImageDrawable, defaultImageDrawable } from './image-drawable';
import { Drawable, DrawableType } from './drawable';
import {
  drawableTypeToCppType,
  cloneDrawable,
  newDrawable,
} from './drawable-helpers';
import {
  AutoCreateAnimationDialogComponent,
  AutoCreateDialogResult,
} from './auto-create-animation-dialog.component';

/**
 * Component used to edit an Aniamted Drawable including all its children drawables
 */
@Component({
  selector: 'dk-animated-drawable',
  styleUrls: ['./animated-drawable.component.scss'],
  template: `
    <dk-number-input
      label="Duration (seconds)"
      [value]="animatedDrawable.duration"
      (validInput)="onDurationChanged($event)"
    >
    </dk-number-input>

    <dk-form-label title="Add Frame"></dk-form-label>
    <dk-enum-choice
      [enum]="DrawableType"
      [selected]="DrawableType.Shape"
      (addClicked)="onNewDrawableClicked($event)"
    >
    </dk-enum-choice>
    <span *ngIf="!hasAnyFrames"> OR </span>
    <button
      *ngIf="!hasAnyFrames"
      mat-raised-button
      class="create-from-tilesheet-button"
      title="Create from tilesheet"
      disableRipple="true"
      (click)="onCreateFromTilesheetClicked()"
    >
      Create from tilesheet
    </button>

    <mat-card *ngIf="hasAnyFrames" class="drawables-card">
      <dk-accordion
        titleProperty="key"
        keyProperty="key"
        [elements]="animatedDrawable?.frames"
        [clone]="true"
        (elementDeleted)="onChildDrawablesChanged($event)"
        (elementMovedDown)="onChildDrawablesChanged($event)"
        (elementMovedUp)="onChildDrawablesChanged($event)"
        (elementCloned)="onFrameCloned($event)"
      >
        <ng-template let-element="$element" let-index="$index">
          <dk-drawable
            [drawable]="element"
            [keyValidator]="keyValidator"
            (drawableChanged)="onChildDrawableChanged(index, $event)"
          >
          </dk-drawable>
        </ng-template>
      </dk-accordion>
    </mat-card>
  `,
})
export class AnimatedDrawableComponent {
  // hoist DrawableType so template can access it
  DrawableType = DrawableType;

  @Input() keyValidator: Validator;
  @Input() animatedDrawable: AnimatedDrawable;
  @Output() drawableChanged = new EventEmitter<AnimatedDrawable>();

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _assets: AssetService,
    private _dialog: MatDialog
  ) {}

  onChildDrawableChanged(index: number, newDrawable: Drawable) {
    let newDrawablesPatch: Drawable[] = [];
    newDrawablesPatch[index] = newDrawable;
    this.drawableChanged.emit(
      immutableAssign(this.animatedDrawable, {
        frames: immutableArrayAssign(
          this.animatedDrawable.frames,
          newDrawablesPatch
        ),
      })
    );
  }

  onChildDrawablesChanged(newDrawables: Drawable[]) {
    this.drawableChanged.emit(
      immutableAssign(this.animatedDrawable, {
        frames: newDrawables,
      })
    );
  }

  onNewDrawableClicked(pickedType: DrawableType) {
    let newDrawablesPatch: Drawable[] = [];
    newDrawablesPatch[this.animatedDrawable.frames.length] = newDrawable(
      pickedType,
      this.animatedDrawable.frames
    );
    this.drawableChanged.emit(
      immutableAssign(this.animatedDrawable, {
        frames: immutableArrayAssign(
          this.animatedDrawable.frames,
          newDrawablesPatch
        ),
      })
    );
  }

  onFrameCloned(newDrawables: Drawable[]) {
    let newDrawablesPatch: Drawable[] = [];
    newDrawablesPatch[newDrawables.length - 1] = cloneDrawable(
      newDrawables[newDrawables.length - 1],
      this.animatedDrawable.frames
    );
    this.drawableChanged.emit(
      immutableAssign(this.animatedDrawable, {
        frames: immutableArrayAssign(newDrawables, newDrawablesPatch),
      })
    );
  }

  onDurationChanged(newDuration: number) {
    this.drawableChanged.emit(
      immutableAssign(this.animatedDrawable, { duration: newDuration })
    );
  }

  onCreateFromTilesheetClicked() {
    this._dialog
      .open(AutoCreateAnimationDialogComponent)
      .afterClosed()
      .subscribe((result) => this._autoCreateAnimationFromTilesheet(result));
  }

  private _autoCreateAnimationFromTilesheet(
    dialogResult: AutoCreateDialogResult
  ) {
    if (!dialogResult || !dialogResult.imageKey) {
      return;
    }

    let frames: ImageDrawable[] = [];
    let textureWidth = this._assets.getImageAssetDimensions({
      key: dialogResult.imageKey,
      type: 'TexturePNG',
    }).x;
    for (
      let curY = 0, i = 0;
      frames.length < dialogResult.numFrames;
      curY += dialogResult.frameDimensions.y
    ) {
      for (
        let curX = 0;
        frames.length < dialogResult.numFrames && curX < textureWidth;
        curX += dialogResult.frameDimensions.x
      ) {
        frames.push(
          immutableAssign(defaultImageDrawable, {
            key: defaultImageDrawable.key + (i + 1),
            isWholeImage: false,
            textureRect: {
              position: {
                x: curX,
                y: curY,
              },
              dimension: {
                x: dialogResult.frameDimensions.x,
                y: dialogResult.frameDimensions.y,
              },
            },
            textureKey: dialogResult.imageKey,
          })
        );
        i++;
      }
    }
    this.drawableChanged.emit(
      immutableAssign(this.animatedDrawable, { frames: frames })
    );
  }

  findNextUniqueKey(pickedType: DrawableType, defaultKey: string) {
    let lastKey = 0;
    for (let drawable of this.animatedDrawable.frames) {
      if (drawable.__cpp_type === drawableTypeToCppType(pickedType)) {
        let keyNum: number = +drawable.key.split(defaultKey)[1];
        if (keyNum > lastKey) {
          lastKey = keyNum;
        }
      }
    }
    return ++lastKey;
  }

  get hasAnyFrames() {
    return (
      this.animatedDrawable &&
      this.animatedDrawable.frames &&
      this.animatedDrawable.frames.length > 0
    );
  }
}
