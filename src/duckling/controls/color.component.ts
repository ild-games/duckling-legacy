import { Component, Input, Output, EventEmitter } from '@angular/core';

import { immutableAssign } from '../util';

import { ValidatedInputComponent } from './validated-input.component';

import { Color } from '../canvas/drawing/color';

/**
 * Component for displaying and editing a Color object
 */
@Component({
  selector: 'dk-color',
  styleUrls: ['./color.component.scss'],
  template: `
    <dk-validated-input label="Color R" [value]="color.r.toString()"
    [validator]="isRGBAValue" (validInput)="onColorRInput($event)" />
    <dk-validated-input
      label="Color G"
      [value]="color.g.toString()"
      [validator]="isRGBAValue"
      (validInput)="onColorGInput($event)"
    />
    <dk-validated-input
      label="Color B"
      [value]="color.b.toString()"
      [validator]="isRGBAValue"
      (validInput)="onColorBInput($event)"
    />
    <dk-validated-input
      label="Color A"
      [value]="color.a.toString()"
      [validator]="isRGBAValue"
      (validInput)="onColorAInput($event)"
    />

  `,
})
export class ColorComponent {
  @Input() color: Color;
  @Output() colorChanged = new EventEmitter<Color>();

  onColorRInput(newR: string) {
    this.colorChanged.emit(immutableAssign(this.color, { r: +newR }));
  }

  onColorGInput(newG: string) {
    this.colorChanged.emit(immutableAssign(this.color, { g: +newG }));
  }

  onColorBInput(newB: string) {
    this.colorChanged.emit(immutableAssign(this.color, { b: +newB }));
  }

  onColorAInput(newA: string) {
    this.colorChanged.emit(immutableAssign(this.color, { a: +newA }));
  }

  isRGBAValue(value: string) {
    let number = Number.parseInt(value);
    return number >= 0 && number <= 255;
  }
}
