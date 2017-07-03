import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {immutableAssign} from '../../util/model';
import {Vector} from '../../math/vector';
import {Validator} from '../../controls/validated-input.component';

import { AudioAttribute } from './audio-attribute';

@Component({
    selector: "dk-audio",
    template: `
       <dk-accordion
            [elements]="attribute.sounds"
            (elementDeleted)="onValueChanged($event, key)"
            <ng-template let-element="$element" let-index="$index">
                <md-checkbox
                    [checked]="loopSound">
                </md-checkbox>
            </ng-template>
    </dk-accordion>
    `
})
export class PathComponent {
    @Input() attribute : AudioAttribute;
    @Output() attributeChanged = new EventEmitter<AudioAttribute>();
}