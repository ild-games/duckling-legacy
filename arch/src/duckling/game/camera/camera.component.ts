import { Component, Input, Output, EventEmitter } from "@angular/core";

import { VectorInputComponent, NumberInputComponent } from "../../controls";
import { Vector } from "../../math/vector";
import { immutableAssign } from "../../util/model";
import { EntityKey } from "../../entitysystem/entity";

import { CameraAttribute } from "./camera-attribute";

/**
 * Implementation that will be registered with the AttributeComponentService.
 * @see AttributeComponentService
 * @see AttributeComponent
 */
@Component({
    selector: "dk-camera",
    styleUrls: ["./duckling/game/camera/camera.component.css"],
    template: `
        <div class="default-checkbox">
            <mat-checkbox
                [checked]="attribute.default"
                (change)="onDefaultPressed($event.checked)">
                Default?
            </mat-checkbox>
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

        <dk-number-input
            label="Render Priority"
            [value]="attribute.renderPriority"
            (validInput)="onRenderPriorityChanged($event)">
        </dk-number-input>

        <dk-input
            label="Follows Entity"
            [value]="attribute.follows"
            (inputChanged)="onFollowsChanged($event)">
        </dk-input>

        <dk-vector-input
            xLabel="Upper X Axis Bound"
            yLabel="Upper Y Axis Bound"
            [value]="attribute.upperBounds"
            (validInput)="onUpperBoundsChanged($event)">
        </dk-vector-input>

        <dk-vector-input
            xLabel="Lower X Axis Bound"
            yLabel="Lower Y Axis Bound"
            [value]="attribute.lowerBounds"
            (validInput)="onLowerBoundsChanged($event)">
        </dk-vector-input>
    `,
})
export class CameraComponent {
    @Input() attribute: CameraAttribute;

    @Output() attributeChanged = new EventEmitter<CameraAttribute>();

    onDefaultPressed(newDefault: boolean) {
        this.attributeChanged.emit(
            immutableAssign(this.attribute, { default: newDefault })
        );
    }

    onSizeChanged(newSize: Vector) {
        this.attributeChanged.emit(
            immutableAssign(this.attribute, { size: newSize })
        );
    }

    onOffsetChanged(newOffset: Vector) {
        this.attributeChanged.emit(
            immutableAssign(this.attribute, { offset: newOffset })
        );
    }

    onUpperBoundsChanged(newUpperBounds: Vector) {
        this.attributeChanged.emit(
            immutableAssign(this.attribute, { upperBounds: newUpperBounds })
        );
    }

    onLowerBoundsChanged(newLowerBounds: Vector) {
        this.attributeChanged.emit(
            immutableAssign(this.attribute, { lowerBounds: newLowerBounds })
        );
    }

    onScaleChanged(newScale: number) {
        this.attributeChanged.emit(
            immutableAssign(this.attribute, { scale: newScale })
        );
    }

    onRenderPriorityChanged(newRenderPriority: number) {
        this.attributeChanged.emit(
            immutableAssign(this.attribute, {
                renderPriority: newRenderPriority,
            })
        );
    }

    onFollowsChanged(newFollows: EntityKey) {
        this.attributeChanged.emit(
            immutableAssign(this.attribute, { follows: newFollows })
        );
    }
}
