import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit
} from '@angular/core';
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';

import {EnumChoiceComponent, SelectOption} from '../../controls';
import {immutableAssign} from '../../util/model';
import {NumberInput} from '../../controls/number-input.component';

import {ShapeDrawable} from './shape-drawable';
import {Shape, ShapeType} from './shape';
import {defaultCircle} from './circle';
import {CircleComponent} from './circle.component';
import {defaultRectangle} from './rectangle';
import {RectangleComponent} from './rectangle.component';

@Component({
    selector: "dk-shape-drawable-component",
    directives: [
        CircleComponent,
        RectangleComponent,
        EnumChoiceComponent,
        NumberInput,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
    ],
    template: `
        <div [ngSwitch]="shapeDrawable.shape?.type">
            <dk-enum-choice
                *ngSwitchDefault
                [enum]="ShapeType"
                [selected]="ShapeType.Circle"
                (addClicked)="onShapeTypePicked($event)">
            </dk-enum-choice>

            <dk-circle-component
                *ngSwitchCase="ShapeType.Circle"
                [circle]="shapeDrawable.shape"
                (circleChanged)="onShapeChanged($event)">
            </dk-circle-component>

            <dk-rectangle-component
                *ngSwitchCase="ShapeType.Rectangle"
                [rectangle]="shapeDrawable.shape"
                (rectangleChanged)="onShapeChanged($event)">
            </dk-rectangle-component>
        </div>
    `
})
export class ShapeDrawableComponent {
    // hoist ShapeType so template can access it
    ShapeType = ShapeType;

    @Input() shapeDrawable : ShapeDrawable;
    @Output() drawableChanged = new EventEmitter<ShapeDrawable>();

    onShapeTypePicked(pickedType : ShapeType) {
        var patch : Shape = this.getDefaultShape(pickedType);
        this.drawableChanged.emit(immutableAssign(this.shapeDrawable, {shape: patch}));
    }

    onShapeChanged(shape : Shape) {
        this.drawableChanged.emit(immutableAssign(this.shapeDrawable, {shape: shape}));
    }

    private getDefaultShape(type : ShapeType) : Shape {
        switch (type) {
            case ShapeType.Circle:
                return defaultCircle;
            case ShapeType.Rectangle:
                return defaultRectangle;
            default:
                return null;
        }
    }
}
