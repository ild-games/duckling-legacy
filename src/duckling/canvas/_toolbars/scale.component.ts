import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {NumberInput} from '../../controls';

/**
 * Component for managing the bottom bar controls for the map editor
 */
@Component({
    selector: "dk-scale",
    directives: [NumberInput],
    styleUrls: ['./duckling/canvas/_toolbars/scale.component.css'],
    template: `
        <dk-number-input
            disabled="true"
            label=""
            [value]="(scale * 100).toFixed(0)"
            (validInput)="onScaleInput($event)">
        </dk-number-input>
    `
})
export class ScaleComponent {
    @Input() scale : number;

    @Output() scaleChanged = new EventEmitter<number>();

    onScaleInput(scale : number) {
        this.scaleChanged.emit(scale / 100);
    }
}
