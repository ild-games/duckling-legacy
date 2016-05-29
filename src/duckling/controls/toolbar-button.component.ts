import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';
import {MdButton} from '@angular2-material/button';

@Component({
    selector: "dk-toolbar-button",
    directives: [MdButton],
    styleUrls: ['./duckling/controls/toolbar-button.component.css'],
    template: `
        <button
        md-button
        title="{{tooltip}}"
        color="{{color}}">
            &nbsp;
            <span
                class="oi icon-button"
                attr.data-glyph="{{icon}}">
            </span>
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
