import {
    Component,
    Input
} from '@angular/core';

/**
 * Component used to render a font-icon
 */
@Component({
    selector: "dk-icon",
    template: `
        <i class="fa fa-{{iconClass}}">
        </i>
    `
})
export class Icon {
    @Input() iconClass : string;
}
