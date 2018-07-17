import { Component, Input, Output, EventEmitter } from "@angular/core";

import { EnumSelectComponent } from "./enum-select.component";
import { SelectOption } from "./array-select.component";
import { IconComponent } from "./icon.component";

/**
 * Component used to display a select element of the options in an enum along with a
 * button to add the currently selected element.
 */
@Component({
  selector: "dk-enum-choice",
  template: `
        <dk-enum-select
            [value]="selected"
            [enum]="enum"
            (selection)="select($event)">
        </dk-enum-select>
        <button
            mat-icon-button
            [disableRipple]="true"
            (click)="onAddClicked()">
            <dk-icon iconClass="plus"></dk-icon>
        </button>
    `
})
export class EnumChoiceComponent {
  @Input() enum: any;
  @Input() selected: any;
  @Output() addClicked = new EventEmitter<any>();

  select(enumSelection: any) {
    this.selected = enumSelection;
  }

  onAddClicked() {
    this.addClicked.emit(this.selected);
  }
}
