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
    styleUrls: ['./duckling/controls/toolbar-button.component.css'],
    template: `
        <button
            md-button
            [disableRipple]=true
            title="{{tooltip}}"
            color="{{color}}">
            &nbsp;
            <dk-icon
                class="icon-button"
                [iconClass]="icon">
            </dk-icon>
            <span
                *ngIf="text"
                class="button-text">
                {{text}}
            </span>
            &nbsp;
        </button>
    `
})
export class ToolbarButtonComponent {
    @Input() text : string = "";
    @Input() icon : string = "";
    @Input() color : string = "";
    @Input() tooltip : string = "";
}
