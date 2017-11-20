import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {Validator} from '../../controls/validated-input.component';
import {Vector} from '../../math/vector';
import {immutableAssign} from '../../util/model';

import {Drawable} from './drawable';

/**
 * Component to edit the shared properties of all shapes
 */
@Component({
    selector: "dk-generic-drawable",
    styleUrls: ['./duckling/game/drawable/generic-drawable.component.css'],
    template: `
        <dk-edit-input
            [value]="drawable.key"
            [validator]="combinedValidators"
            label="Key"
            editTooltip="Edit drawable key"
            validTooltip="Save drawable key"
            invalidTooltip="Entity name cannot be a duplicate or blank"
            (onValueSaved)="onSaveDrawableKey($event)">
        </dk-edit-input>
        
        <div class="inactive-checkbox">
            <mat-checkbox
                class="inactive-checkbox"
                [checked]="drawable.inactive"
                (change)="onInactivePressed($event.checked)">
                Inactive?
            </mat-checkbox>
        </div>

        <dk-number-input
            label="Render Priority"
            [value]="drawable.renderPriority"
            (validInput)="onRenderPriorityInput($event)">
        </dk-number-input>

        <dk-vector-input
            xLabel="Scale X"
            yLabel="Scale Y"
            [value]="drawable.scale"
            (validInput)="onScaleInput($event)">
        </dk-vector-input>

        <dk-vector-input
            xLabel="Relative Anchor X %"
            yLabel="Relative Anchor Y %"
            [value]="drawable.anchor"
            (validInput)="onAnchorInput($event)">
        </dk-vector-input>

        <dk-number-input
            label="Rotation"
            [value]="drawable.rotation"
            (validInput)="onRotationInput($event)">
        </dk-number-input>
    `
})
export class GenericDrawableComponent {
    @Input() keyValidator : Validator;
    @Input() drawable : Drawable;
    @Output() drawableChanged = new EventEmitter<Drawable>();
    
    onSaveDrawableKey(newKey : string) {
        this.drawableChanged.emit(immutableAssign(this.drawable, {key: newKey}));
    }

    onRenderPriorityInput(newRenderPriority : number) {
        this.drawableChanged.emit(immutableAssign(this.drawable, {renderPriority: newRenderPriority}));
    }

    onScaleInput(newScale : Vector) {
        this.drawableChanged.emit(immutableAssign(this.drawable, {scale: newScale}));
    }

    onAnchorInput(newAnchor : Vector) {
        this.drawableChanged.emit(immutableAssign(this.drawable, {anchor: newAnchor}));
    }

    onRotationInput(newRotation : number) {
        this.drawableChanged.emit(immutableAssign(this.drawable, {rotation: newRotation}));
    }

    onInactivePressed(inactive : boolean) {
        this.drawableChanged.emit(immutableAssign(this.drawable, {inactive: inactive}));
    }

    get combinedValidators() : Validator {
        return (value : string) => {
            if (value === this.drawable.key) {
                return true;
            }

            return this.keyValidator(value);
        }
    }
}
