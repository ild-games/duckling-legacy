import {
    Component,
    Input
} from '@angular/core';

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
