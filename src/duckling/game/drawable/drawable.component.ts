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
            *ngIf="attribute.topDrawable?.type !== null"
            [drawable]="attribute.topDrawable"
            (drawableChanged)="specificDrawableChanged($event)">
        </dk-generic-drawable-component>

        <div [ngSwitch]="attribute.topDrawable?.type">
            <dk-enum-choice
                *ngSwitchDefault
                [enum]="DrawableType"
                [selected]="DrawableType.Shape"
                (addClicked)="onDrawableTypePicked($event)">
            </dk-enum-choice>

            <dk-shape-drawable-component
                *ngSwitchCase="DrawableType.Shape"
                [shapeDrawable]="attribute.topDrawable"
                (drawableChanged)="specificDrawableChanged($event)">
            </dk-shape-drawable-component>

            <dk-container-drawable-component
                *ngSwitchCase="DrawableType.Container"
                [containerDrawable]="attribute.topDrawable"
                (drawableChanged)="specificDrawableChanged($event)">
            </dk-container-drawable-component>
        </div>
    `
})
export class DrawableComponent {
    // hoist DrawableType so template can access it
    DrawableType = DrawableType;

    @Input() attribute : DrawableAttribute;
    @Output() attributeChanged = new EventEmitter<DrawableAttribute>();

    onDrawableTypePicked(pickedType : DrawableType) {
        var patch : DrawableAttribute = {
            topDrawable: this.getDefaultDrawable(pickedType)
        };
        this.attributeChanged.emit(immutableAssign(this.attribute, patch));
    }

    specificDrawableChanged(drawable : Drawable) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {topDrawable: drawable}));
    }

    private getDefaultDrawable(type : DrawableType) : Drawable {
        switch (type) {
            default:
                return null;
            case DrawableType.Shape:
                return defaultShapeDrawable;
            case DrawableType.Container:
                return defaultContainerDrawable;
        }
    }
}
