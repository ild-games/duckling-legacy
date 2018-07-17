import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from "@angular/core";

import { immutableAssign } from "../../util/model";

import { TextDrawable } from "./text-drawable";
import { SFMLText } from "./sfml-text";

@Component({
  selector: "dk-text-drawable",
  template: `
        <dk-sfml-text
            [sfmlText]="textDrawable.text"
            (sfmlTextChanged)="onSFMLTextChanged($event)">
        </dk-sfml-text>
    `
})
export class TextDrawableComponent {
  @Input() textDrawable: TextDrawable;

  @Output() drawableChanged = new EventEmitter<TextDrawable>();

  onSFMLTextChanged(newText: SFMLText) {
    this.drawableChanged.emit(
      immutableAssign(this.textDrawable, { text: newText })
    );
  }
}
