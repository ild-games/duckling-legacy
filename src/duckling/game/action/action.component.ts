import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {ActionAttribute} from './action-attribute';

@Component({
    selector: "dk-collision-component",
    template: `
        This entity has an action attribute
    `
})
export class ActionComponent {
    @Input() attribute : ActionAttribute;
    @Output() attributeChanged = new EventEmitter<ActionAttribute>();
}
