import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';

import {Validator} from '../../controls/validated-input.component';
import {EnumChoiceComponent, VectorInputComponent, FormLabelComponent} from '../../controls';
import {immutableAssign} from '../../util';

import {DrawableAttribute} from './drawable-attribute';
import {Drawable, DrawableType, cppTypeToDrawableType} from './drawable';
import {defaultShapeDrawable} from './shape-drawable';
import {defaultContainerDrawable} from './container-drawable';
import {defaultAnimatedDrawable} from './animated-drawable';
import {defaultImageDrawable} from './image-drawable';
import {defaultTextDrawable} from './text-drawable';
import {ShapeDrawableComponent} from './shape-drawable.component';
import {ContainerDrawableComponent} from './container-drawable.component';
import {AnimatedDrawableComponent} from './animated-drawable.component';
import {ImageDrawableComponent} from './image-drawable.component';
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
        case DrawableType.Image:
            return defaultImageDrawable;
        case DrawableType.Animated:
            return defaultAnimatedDrawable;
        case DrawableType.Text:
            return defaultTextDrawable;
    }
}

/**
 * Component used to edit non-type specified drawable
 */
@Component({
    selector: "dk-drawable",
    template: `
        <dk-generic-drawable
            *ngIf="drawable?.__cpp_type !== null"
            [drawable]="drawable"
            [keyValidator]="keyValidator"
            (drawableChanged)="specificDrawableChanged($event)">
        </dk-generic-drawable>

        <div [ngSwitch]="cppTypeToDrawableType(drawable?.__cpp_type)">
            <dk-enum-choice
                *ngSwitchDefault
                [enum]="DrawableType"
                [selected]="DrawableType.Shape"
                (addClicked)="onDrawableTypePicked($event)">
            </dk-enum-choice>

            <dk-shape-drawable
                *ngSwitchCase="DrawableType.Shape"
                [shapeDrawable]="drawable"
                (drawableChanged)="specificDrawableChanged($event)">
            </dk-shape-drawable>

            <dk-container-drawable
                *ngSwitchCase="DrawableType.Container"
                [containerDrawable]="drawable"
                [keyValidator]="keyValidator"
                (drawableChanged)="specificDrawableChanged($event)">
            </dk-container-drawable>

            <dk-image-drawable
                *ngSwitchCase="DrawableType.Image"
                [imageDrawable]="drawable"
                (drawableChanged)="specificDrawableChanged($event)">
            </dk-image-drawable>

            <dk-animated-drawable
                *ngSwitchCase="DrawableType.Animated"
                [animatedDrawable]="drawable"
                [keyValidator]="keyValidator"
                (drawableChanged)="specificDrawableChanged($event)">
            </dk-animated-drawable>

            <dk-text-drawable
                *ngSwitchCase="DrawableType.Text"
                [textDrawable]="drawable"
                (drawableChanged)="specificDrawableChanged($event)">
            </dk-text-drawable>
        </div>
    `
})
export class DrawableComponent {
    // hoist DrawableType so template can access it
    DrawableType = DrawableType;
    cppTypeToDrawableType = cppTypeToDrawableType;

    @Input() keyValidator : Validator;
    @Input() drawable : Drawable;
    @Output() drawableChanged = new EventEmitter<Drawable>();

    onDrawableTypePicked(pickedType : DrawableType) {
        this.drawableChanged.emit(immutableAssign(this.drawable, getDefaultDrawable(pickedType)));
    }

    specificDrawableChanged(newDrawable : Drawable) {
        this.drawableChanged.emit(immutableAssign(this.drawable, newDrawable));
    }
}
