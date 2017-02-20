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
    styleUrls: ['./duckling/game/path/path.component.css'],
    template: `
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
            <dk-accordian
                [elements]="attribute?.vertices"
                [clone]="true"
                (elementDeleted)="onVerticesChanged($event)"
                (elementMovedDown)="onVerticesChanged($event)"
                (elementMovedUp)="onVerticesChanged($event)"
                (elementCloned)="onVerticesChanged($event)">
                <template let-element="$element" let-index="$index">
                    <dk-vector-input
                        xLabel="Vertex X"
                        yLabel="Vertex Y"
                        [value]="element"
                        (validInput)="onVertexChanged(index, $event)">
                    </dk-vector-input>
                </template>
            </dk-accordian>
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
        let newVertices = this.attribute.vertices.slice(0);
        newVertices[index] = newVertex;
        this.attributeChanged.emit(immutableAssign(this.attribute, {vertices: newVertices}));
    }

    onIsLoopChanged(newIsLoop : boolean) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {isLoop: newIsLoop}));
    }

    onNewVertexClicked() {
        this.attributeChanged.emit(immutableAssign(this.attribute, {
            vertices: this.attribute.vertices.concat([{x: 0, y: 0}])
        }));
    }
}