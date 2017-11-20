import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {IconButtonComponent} from './icon-button.component';

/**
 * Component for a general purpose delete button
 */
@Component({
    selector: "dk-delete-button",
    styleUrls: ['../build/duckling/controls/delete-button.component.css'],
    template: `
        <div class="hover">
            <dk-icon-button
                class="non-hover-button"
                tooltip="Delete"
                icon="trash"
                (iconClick)="onClick()">
            </dk-icon-button>
            <dk-icon-button
                class="hover-button"
                tooltip="Delete"
                color="warn"
                icon="trash-o"
                [isRaised]="true"
                (iconClick)="onClick()">
            </dk-icon-button>
        </div>
    `
})
export class DeleteButtonComponent {
    @Output() deleteClick = new EventEmitter<any>();

    onClick() {
        this.deleteClick.emit(true);
    }
}
