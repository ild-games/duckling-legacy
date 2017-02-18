import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {immutableAssign} from '../../util/model';
import {Vector} from '../../math/vector';

import {PathAttribute} from './path-attribute';

@Component({
    selector: "dk-path",
    template: `
        <dk-vector-input
            xLabel="Starting Vertex X"
            yLabel="Starting Vertex Y"
            [value]="attribute.startVertex"
            (validInput)="onStartVertexInput($event)">
        </dk-vector-input>
        
        <dk-vector-input
            xLabel="Ending Vertex X"
            yLabel="Ending Vertex Y"
            [value]="attribute.endVertex"
            (validInput)="onEndVertexInput($event)">
        </dk-vector-input>
    `
})
export class PathComponent {
    @Input() attribute : PathAttribute;
    @Output() attributeChanged = new EventEmitter<PathAttribute>();

    onStartVertexInput(newStartVertex : Vector) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {startVertex: newStartVertex}));
    }

    onEndVertexInput(newEndVertex : Vector) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {endVertex: newEndVertex}));
    }
}