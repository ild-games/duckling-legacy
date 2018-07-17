import { Component, Input, Output, EventEmitter } from "@angular/core";

import { ButtonAttribute } from "./button-attribute";
import { InputComponent } from "../../controls";
import { immutableAssign } from "../../util/model";

/**
 * Implementation that will be registered with the AttributeComponentService.
 * @see AttributeComponentService
 * @see AttributeComponent
 */
@Component({
  selector: "dk-button-attribute",
  template: `
        <dk-input
            label="Button Key"
            [value]="attribute.key"
            (inputChanged)="keyChanged($event)">
        </dk-input>
        <p>
        The collision attribute controls the clickable area of the button. The CollisionType and BodyType do not matter.

        <br /> <br />

        The drawable attribute controls the display of the button. The attribute should have drawables with the keys "pressed", "hover", and "normal". The button
        attribute will hide and show the drawables depending on the button's state.
        </p>
    `
})
export class ButtonComponent {
  @Input() attribute: ButtonAttribute;

  @Output() attributeChanged = new EventEmitter<ButtonAttribute>();

  keyChanged(key: string) {
    this.attributeChanged.emit(immutableAssign(this.attribute, { key }));
  }
}
