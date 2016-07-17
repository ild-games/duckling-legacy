import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {MdButton} from '@angular2-material/button';

import {Icon} from './icon.component';

/**
 * Component for buttons displayed in a toolbar
 */
@Component({
    selector: "dk-toolbar-button",
    directives: [Icon, MdButton],
    styleUrls: ['./duckling/controls/toolbar-button.component.css'],
    template: `
        <button
            md-button
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
export class ToolbarButton {
    @Input() text : string = "";
    @Input() icon : string = "";
    @Input() color : string = "";
    @Input() tooltip : string = "";
}
