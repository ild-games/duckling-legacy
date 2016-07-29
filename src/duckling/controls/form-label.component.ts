import {
    Component,
    Input
} from '@angular/core';

/**
 * A simple label for a form
 */
@Component({
    selector: "dk-form-label",
    styleUrls: ['./duckling/controls/form-label.component.css'],
    template:`
        <div class="form-label">{{title}}</div>
    `
})
export class FormLabel {
    @Input() title : string;
}
