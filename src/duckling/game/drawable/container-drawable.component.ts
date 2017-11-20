import {
    Component,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';

import {Validator} from '../../controls/validated-input.component';
import {AccordionComponent, FormLabelComponent, EnumChoiceComponent} from '../../controls';
import {immutableAssign, immutableArrayAssign} from '../../util';


import {ContainerDrawable} from './container-drawable';
import {DrawableComponent} from './drawable.component';
import {Drawable, DrawableType} from './drawable';
import {
    drawableTypeToCppType, 
    cppTypeToDrawableType,
    cloneDrawable,
    newDrawable
} from './drawable-helpers';

/**
 * Component used to edit a Container Drawable including all its children drawables
 */
@Component({
    selector: "dk-container-drawable",
    styleUrls: ['./duckling/game/drawable/container-drawable.component.css'],
    template: `
        <dk-form-label title="Add Drawable"></dk-form-label>
        <dk-enum-choice
            [enum]="DrawableType"
            [selected]="DrawableType.Shape"
            (addClicked)="onNewDrawableClicked($event)">
        </dk-enum-choice>

        <mat-card
            *ngIf="containerDrawable?.drawables?.length > 0"
            class="drawables-card">
            <dk-accordion
                [elements]="containerDrawable?.drawables"
                titleProperty="key"
                keyProperty="key"
                [clone]="true"
                (elementDeleted)="onChildDrawablesChanged($event)"
                (elementMovedDown)="onChildDrawablesChanged($event)"
                (elementMovedUp)="onChildDrawablesChanged($event)"
                (elementCloned)="onChildDrawableCloned($event)">
                <ng-template let-element="$element" let-index="$index">
                    <dk-drawable
                        [drawable]="element"
                        [keyValidator]="keyValidator"
                        (drawableChanged)="onChildDrawableChanged(index, $event)">
                    </dk-drawable>
                </ng-template>
            </dk-accordion>
        </mat-card>
    `
})
export class ContainerDrawableComponent {
    // hoist DrawableType so template can access it
    DrawableType = DrawableType;

    @Input() keyValidator : Validator;
    @Input() containerDrawable : ContainerDrawable;
    @Output() drawableChanged = new EventEmitter<ContainerDrawable>();

    onChildDrawableChanged(index : number, newDrawable : Drawable) {
        let newDrawablesPatch : Drawable[] = [];
        newDrawablesPatch[index] = newDrawable;
        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {
            drawables: immutableArrayAssign(this.containerDrawable.drawables, newDrawablesPatch)
        }));
    }

    onChildDrawablesChanged(newDrawables : Drawable[]) {
        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {
            drawables: newDrawables
        }));
    }

    onNewDrawableClicked(pickedType : DrawableType) {
        let newDrawablesPatch : Drawable[] = [];
        newDrawablesPatch[this.containerDrawable.drawables.length] = newDrawable(pickedType, this.containerDrawable.drawables);
        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {
            drawables: immutableArrayAssign(this.containerDrawable.drawables, newDrawablesPatch)
        }));
    }

    onChildDrawableCloned(newDrawables : Drawable[]) {
        let newDrawablesPatch : Drawable[] = [];
        newDrawablesPatch[newDrawables.length - 1] = cloneDrawable(newDrawables[newDrawables.length - 1], this.containerDrawable.drawables);
        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {
            drawables: immutableArrayAssign(newDrawables, newDrawablesPatch)
        }));
    }
}
