import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

/**
 * Component for a general purpose button
 */
@Component({
    selector: "dk-button",
    styleUrls: ['../build/duckling/controls/button.component.css'],
    template: `
        <button
            md-button
            [title]="tooltip"
            [disableRipple]=true
            [disabled]="disabled"
            [color]="color">
            {{text}}
            <dk-icon [iconClass]="icon"></dk-icon>
        </button>
    `
})
export class ButtonComponent {
    @Input() text : string = ""
    @Input() icon : string = "";
    @Input() color : string = "";
    @Input() tooltip : string = "";
    @Input() disabled : boolean = false;
}
