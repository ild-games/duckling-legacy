import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { asRect, asCircle } from './shape-drawable';

import {
  EnumChoiceComponent,
  SelectOption,
  FormLabelComponent,
} from '../../controls';
import { immutableAssign } from '../../util/model';
import { NumberInputComponent } from '../../controls/number-input.component';

import { ShapeDrawable } from './shape-drawable';
import { GenericShapeComponent } from './generic-shape.component';
import { Shape, ShapeType, cppTypeToShapeType } from './shape';
import { defaultCircle } from './circle';
import { CircleComponent } from './circle.component';
import { defaultRectangle } from './rectangle';
import { RectangleComponent } from './rectangle.component';

/**
 * Component used to edit a ShapeDrawable
 */
@Component({
  selector: 'dk-shape-drawable',
  template: `
    <dk-generic-shape
      *ngIf="shapeDrawable.shape?.__cpp_type !== null"
      [shape]="shapeDrawable.shape"
      (shapeChanged)="specificShapeChanged($event)"
    >
    </dk-generic-shape>

    <div [ngSwitch]="cppTypeToShapeType(shapeDrawable.shape?.__cpp_type)">
      <dk-enum-choice
        *ngSwitchDefault
        [enum]="ShapeType"
        [selected]="ShapeType.Circle"
        (addClicked)="onShapeTypePicked($event)"
      >
      </dk-enum-choice>

      <dk-circle-drawable
        *ngSwitchCase="ShapeType.Circle"
        [circle]="asCircle(shapeDrawable.shape)"
        (circleChanged)="onShapeChanged($event)"
      >
      </dk-circle-drawable>

      <dk-rectangle-drawable
        *ngSwitchCase="ShapeType.Rectangle"
        [rectangle]="asRect(shapeDrawable.shape)"
        (rectangleChanged)="onShapeChanged($event)"
      >
      </dk-rectangle-drawable>
    </div>
  `,
})
export class ShapeDrawableComponent {
  // hoist ShapeType so template can access it
  ShapeType = ShapeType;
  cppTypeToShapeType = cppTypeToShapeType;

  @Input() shapeDrawable: ShapeDrawable;
  @Output() drawableChanged = new EventEmitter<ShapeDrawable>();

  specificShapeChanged(newShape: Shape) {
    this.drawableChanged.emit(
      immutableAssign(this.shapeDrawable, { shape: newShape })
    );
  }

  onShapeTypePicked(pickedType: ShapeType) {
    let patch: Shape = this._getDefaultShape(pickedType);
    this.drawableChanged.emit(
      immutableAssign(this.shapeDrawable, { shape: patch })
    );
  }

  onShapeChanged(shape: Shape) {
    this.drawableChanged.emit(
      immutableAssign(this.shapeDrawable, { shape: shape })
    );
  }

  private _getDefaultShape(type: ShapeType): Shape {
    switch (type) {
      case ShapeType.Circle:
        return defaultCircle;
      case ShapeType.Rectangle:
        return defaultRectangle;
      default:
        return null;
    }
  }
  asRect = asRect;
  asCircle = asCircle;
}
