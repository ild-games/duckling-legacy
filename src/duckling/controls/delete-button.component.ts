import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {Icon} from './icon.component';

/**
 * Component for a general purpose delete button
 */
@Component({
    selector: "dk-delete-button",
    directives: [Icon],
    styleUrls: ['./duckling/controls/delete-button.component.css'],
    template: `
        <div class="hover">
            <button
                md-button
                class="non-hover-button"
                title="Delete"
                [disableRipple]=true
                (click)="onClick()">
                &nbsp;
                <dk-icon iconClass="trash"></dk-icon>
                &nbsp;
            </button>
            <button
                md-raised-button
                class="hover-button"
                color="warn"
                title="Delete"
                [disableRipple]=true
                (click)="onClick()">
                &nbsp;
                <dk-icon iconClass="trash-o"></dk-icon>
                &nbsp;
            </button>
        </div>
    `
})
export class DeleteButton {
    @Output() click = new EventEmitter<any>();

    onClick() {
        this.click.emit(true);
    }
}
