import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {IconComponent} from './icon.component';

/**
 * Component for buttons displayed in a toolbar
 */
@Component({
    selector: "dk-toolbar-button",
    styleUrls: ['../build/duckling/controls/toolbar-button.component.css'],
    template: `
        <button
            md-button
            [disableRipple]=true
            title="{{tooltip}}"
            color="{{color}}">
            <dk-icon
                class="icon-button"
                [iconClass]="icon">
            </dk-icon>
            <span
                *ngIf="text"
                class="button-text">
                {{text}}
            </span>
        </button>
    `
})
export class ToolbarButtonComponent {
    @Input() text : string = "";
    @Input() icon : string = "";
    @Input() color : string = "";
    @Input() tooltip : string = "";
}
