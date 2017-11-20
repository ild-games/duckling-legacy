import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {immutableAssign} from '../../util/model';
import {Vector} from '../../math/vector';
import {Validator} from '../../controls/validated-input.component';

import {PathAttribute} from './path-attribute';

@Component({
    selector: "dk-path",
    styleUrls: ['../build/duckling/game/path/path.component.css'],
    template: `
        <dk-number-input
            label="Time To Complete Path"
            [value]="attribute.cycleTime"
            [validator]="timeValidator"
            (validInput)="onCycleTimeChanged($event)">
        </dk-number-input>
        
        <md-checkbox
            [checked]="attribute.isLoop"
            (change)="onIsLoopChanged($event.checked)">
            Is a Loop?
        </md-checkbox>
            
        <button
            md-raised-button
            class="add-vertex-button"
            [disableRipple]="true"
            (click)="onNewVertexClicked()">
            <dk-icon iconClass="plus"></dk-icon>
            <span>Add Vertex</span>
        </button>
        
        <div class="form-label">Vertices</div>
        <md-card class="vertices-card">
            <dk-accordion
                [elements]="attribute?.vertices"
                [clone]="true"
                (elementDeleted)="onVerticesChanged($event)"
                (elementMovedDown)="onVerticesChanged($event)"
                (elementMovedUp)="onVerticesChanged($event)"
                (elementCloned)="onVerticesChanged($event)">
                <ng-template let-element="$element" let-index="$index">
                    <dk-vector-input
                        xLabel="Vertex X"
                        yLabel="Vertex Y"
                        [value]="element"
                        (validInput)="onVertexChanged(index, $event)">
                    </dk-vector-input>
                </ng-template>
            </dk-accordion>
        </md-card> 
    `
})
export class PathComponent {
    @Input() attribute : PathAttribute;
    @Output() attributeChanged = new EventEmitter<PathAttribute>();

    onVerticesChanged(newVertices : Vector[]) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {vertices: newVertices}));
    }
    
    onVertexChanged(index : number, newVertex : Vector) {
        let newVertices = [...this.attribute.vertices];
        newVertices[index] = newVertex;
        this.attributeChanged.emit(immutableAssign(this.attribute, {vertices: newVertices}));
    }

    onIsLoopChanged(newIsLoop : boolean) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {isLoop: newIsLoop}));
    }
    
    onCycleTimeChanged(newCycleTime : number) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {cycleTime: newCycleTime}));
    }

    onNewVertexClicked() {
        this.attributeChanged.emit(immutableAssign(this.attribute, {
            vertices: this.attribute.vertices.concat([{x: 0, y: 0}])
        }));
    }

    get timeValidator() : Validator {
        return (value : string) => {
            return Number.isInteger(parseInt(value)) && parseFloat(value) > 0;
        }
    }
}
