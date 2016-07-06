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
        <span
            class="oi"
            attr.data-glyph="{{iconKey}}">
        </span>
    `
})
export class Icon {
    @Input() iconKey : string;
}
