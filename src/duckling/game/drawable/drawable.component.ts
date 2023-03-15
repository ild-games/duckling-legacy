import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

import { Validator } from '../../controls/validated-input.component';
import {
  EnumChoiceComponent,
  VectorInputComponent,
  FormLabelComponent,
} from '../../controls';
import { immutableAssign } from '../../util';

import { DrawableAttribute } from './drawable-attribute';
import { Drawable, DrawableType } from './drawable';
import { cppTypeToDrawableType, getDefaultDrawable } from './drawable-helpers';
import { ShapeDrawableComponent } from './shape-drawable.component';
import { ContainerDrawableComponent } from './container-drawable.component';
import { AnimatedDrawableComponent } from './animated-drawable.component';
import { ImageDrawableComponent } from './image-drawable.component';
import { TileBlockDrawableComponent } from './tile-block-drawable.component';
import { GenericDrawableComponent } from './generic-drawable.component';
import { ShapeDrawable } from './shape-drawable';
import { ContainerDrawable } from './container-drawable';
import { TileBlockDrawable } from './tile-block-drawable';
import { ImageDrawable } from './image-drawable';
import { AnimatedDrawable } from './animated-drawable';
import { TextDrawable } from './text-drawable';

/**
 * Component used to edit non-type specified drawable
 */
@Component({
  selector: 'dk-drawable',
  template: `
    <dk-generic-drawable
      *ngIf="drawable?.__cpp_type !== null"
      [drawable]="drawable"
      [keyValidator]="keyValidator"
      (drawableChanged)="specificDrawableChanged($event)"
    >
    </dk-generic-drawable>

    <div [ngSwitch]="cppTypeToDrawableType(drawable?.__cpp_type)">
      <dk-enum-choice
        *ngSwitchDefault
        [enum]="DrawableType"
        [selected]="DrawableType.Shape"
        (addClicked)="onDrawableTypePicked($event)"
      >
      </dk-enum-choice>

      <dk-shape-drawable
        *ngSwitchCase="DrawableType.Shape"
        [shapeDrawable]="asShape(drawable)"
        (drawableChanged)="specificDrawableChanged($event)"
      >
      </dk-shape-drawable>

      <dk-container-drawable
        *ngSwitchCase="DrawableType.Container"
        [containerDrawable]="asContainer(drawable)"
        [keyValidator]="keyValidator"
        (drawableChanged)="specificDrawableChanged($event)"
      >
      </dk-container-drawable>

      <dk-image-drawable
        *ngSwitchCase="DrawableType.Image"
        [imageDrawable]="asImage(drawable)"
        (drawableChanged)="specificDrawableChanged($event)"
      >
      </dk-image-drawable>

      <dk-tile-block-drawable
        *ngSwitchCase="DrawableType.TileBlock"
        [tileBlockDrawable]="asTileBlock(drawable)"
        (drawableChanged)="specificDrawableChanged($event)"
      >
      </dk-tile-block-drawable>

      <dk-animated-drawable
        *ngSwitchCase="DrawableType.Animated"
        [animatedDrawable]="asAnimated(drawable)"
        [keyValidator]="keyValidator"
        (drawableChanged)="specificDrawableChanged($event)"
      >
      </dk-animated-drawable>

      <dk-text-drawable
        *ngSwitchCase="DrawableType.Text"
        [textDrawable]="asText(drawable)"
        (drawableChanged)="specificDrawableChanged($event)"
      >
      </dk-text-drawable>
    </div>
  `,
})
export class DrawableComponent {
  // hoist DrawableType so template can access it
  DrawableType = DrawableType;
  cppTypeToDrawableType = cppTypeToDrawableType;

  @Input() keyValidator: Validator;
  @Input() drawable: Drawable;
  @Output() drawableChanged = new EventEmitter<Drawable>();

  onDrawableTypePicked(pickedType: DrawableType) {
    this.drawableChanged.emit(
      immutableAssign(this.drawable, getDefaultDrawable(pickedType))
    );
  }

  specificDrawableChanged(newDrawable: Drawable) {
    this.drawableChanged.emit(immutableAssign(this.drawable, newDrawable));
  }

  asShape(d: Drawable): ShapeDrawable {
    return d as ShapeDrawable;
  }
  asContainer(d: Drawable): ContainerDrawable {
    return d as ContainerDrawable;
  }
  asImage(d: Drawable): ImageDrawable {
    return d as ImageDrawable;
  }
  asTileBlock(d: Drawable): TileBlockDrawable {
    return d as TileBlockDrawable;
  }
  asAnimated(d: Drawable): AnimatedDrawable {
    return d as AnimatedDrawable;
  }
  asText(d: Drawable): TextDrawable {
    return d as TextDrawable;
  }
}
