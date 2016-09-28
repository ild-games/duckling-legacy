import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {VectorInputComponent, NumberInputComponent} from '../../controls';
import {Vector} from '../../math/vector';
import {immutableAssign} from '../../util/model';
import {EntityKey} from '../../entitysystem/entity';

import {CameraAttribute} from './camera-attribute';

/**
 * Implementation that will be registered with the AttributeComponentService.
 * @see AttributeComponentService
 * @see AttributeComponent
 */
@Component({
    selector: "dk-camera",
    styleUrls: ['./duckling/game/camera/camera.component.css'],
    template: `
        <div class="default-checkbox">
            <md-checkbox
                [checked]="attribute.default"
                (change)="onDefaultPressed($event.checked)">
                Default?
            </md-checkbox>
        </div>

        <dk-vector-input
            xLabel="Size X"
            yLabel="Size Y"
            [value]="attribute.size"
            (validInput)="onSizeChanged($event)">
        </dk-vector-input>

        <dk-vector-input
            xLabel="Offset X"
            yLabel="Offset Y"
            [value]="attribute.offset"
            (validInput)="onOffsetChanged($event)">
        </dk-vector-input>

        <dk-number-input
            label="Scale"
            [value]="attribute.scale"
            (validInput)="onScaleChanged($event)">
        </dk-number-input>

        <dk-input
            label="Follows Entity"
            [value]="attribute.follows"
            (inputChanged)="onFollowsChanged($event)">
        </dk-input>
    `
})
export class CameraComponent {

    @Input() attribute : CameraAttribute;

    @Output() attributeChanged = new EventEmitter<CameraAttribute>();

    onDefaultPressed(newDefault : boolean) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {default: newDefault}));
    }

    onSizeChanged(newSize : Vector) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {size: newSize}));
    }

    onOffsetChanged(newOffset : Vector) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {offset: newOffset}));
    }

    onScaleChanged(newScale : Vector) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {scale: newScale}));
    }

    onFollowsChanged(newFollows : EntityKey) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {follows: newFollows}));
    }
}
