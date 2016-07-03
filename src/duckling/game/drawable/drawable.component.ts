import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';

import {EnumChoiceComponent} from '../../controls';
import {immutableAssign} from '../../util';

import {DrawableAttribute} from './drawable-attribute';
import {Drawable, DrawableType} from './drawable';
import {defaultShapeDrawable} from './shape-drawable';
import {ShapeDrawableComponent} from './shape-drawable.component';

@Component({
    selector: "dk-drawable-component",
    directives: [
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        EnumChoiceComponent,
        ShapeDrawableComponent
    ],
    template: `
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

            <div *ngSwitchCase="DrawableType.Container">
                Hello im container drawable hi
            </div>
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
        }
    }
}
