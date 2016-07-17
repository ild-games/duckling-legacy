import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';

import {EnumChoiceComponent, VectorInput, FormLabel} from '../../controls';
import {immutableAssign} from '../../util';

import {DrawableAttribute} from './drawable-attribute';
import {Drawable, DrawableType} from './drawable';
import {defaultShapeDrawable} from './shape-drawable';
import {defaultContainerDrawable} from './container-drawable';
import {ShapeDrawableComponent} from './shape-drawable.component';
import {ContainerDrawableComponent} from './container-drawable.component';
import {GenericDrawableComponent} from './generic-drawable.component';

/**
 * Gets the default drawable based on the given DrawableType
 * @param  type Type of the drawable
 * @return Default drawable implementation for the given type
 */
export function getDefaultDrawable(type : DrawableType) : Drawable {
    switch (type) {
        default:
            return null;
        case DrawableType.Shape:
            return defaultShapeDrawable;
        case DrawableType.Container:
            return defaultContainerDrawable;
    }
}

/**
 * Component used to edit non-type specified drawable
 */
@Component({
    selector: "dk-drawable-component",
    directives: [
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        EnumChoiceComponent,
        GenericDrawableComponent,
        ShapeDrawableComponent,
        ContainerDrawableComponent
    ],
    template: `
        <dk-generic-drawable-component
            *ngIf="drawable?.type !== null"
            [drawable]="drawable"
            (drawableChanged)="specificDrawableChanged($event)">
        </dk-generic-drawable-component>

        <div [ngSwitch]="drawable?.type">
            <dk-enum-choice
                *ngSwitchDefault
                [enum]="DrawableType"
                [selected]="DrawableType.Shape"
                (addClicked)="onDrawableTypePicked($event)">
            </dk-enum-choice>

            <dk-shape-drawable-component
                *ngSwitchCase="DrawableType.Shape"
                [shapeDrawable]="drawable"
                (drawableChanged)="specificDrawableChanged($event)">
            </dk-shape-drawable-component>

            <dk-container-drawable-component
                *ngSwitchCase="DrawableType.Container"
                [containerDrawable]="drawable"
                (drawableChanged)="specificDrawableChanged($event)">
            </dk-container-drawable-component>
        </div>
    `
})
export class DrawableComponent {
    // hoist DrawableType so template can access it
    DrawableType = DrawableType;

    @Input() drawable : Drawable;
    @Output() drawableChanged = new EventEmitter<Drawable>();

    onDrawableTypePicked(pickedType : DrawableType) {
        this.drawableChanged.emit(immutableAssign(this.drawable, getDefaultDrawable(pickedType)));
    }

    specificDrawableChanged(newDrawable : Drawable) {
        this.drawableChanged.emit(immutableAssign(this.drawable, newDrawable));
    }
}
