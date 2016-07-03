import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit
} from '@angular/core';
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';

import {immutableAssign} from '../../util';

import {DrawableAttribute, DrawableType} from './drawable-attribute';
import {ShapeDrawableAttribute} from './shape-drawable-attribute';
import {DrawableSelectorComponent} from './drawable-selector.component';

@Component({
    selector: "dk-drawable-component",
    directives: [NgSwitch, NgSwitchCase, NgSwitchDefault, DrawableSelectorComponent],
    styleUrls: ['./duckling/game/drawable/drawable.component.css'],
    template: `
        <div [ngSwitch]="attribute.type">
            <div *ngSwitchDefault>
                <dk-drawable-selector-component
                    [selected]="DrawableType.Shape"
                    (addClicked)="onDrawableTypePicked($event)">
                </dk-drawable-selector-component>
            </div>
            <div *ngSwitchCase="DrawableType.Shape">
                Hello im shape drawable hi
            </div>
            <div *ngSwitchCase="DrawableType.Container">
                Hello im container drawable hi
            </div>
        </div>
    `
})
export class DrawableComponent implements AfterViewInit {
    // hoist DrawableType so template can access it
    DrawableType = DrawableType;

    @Input() attribute : DrawableAttribute;
    @Output() attributeChanged = new EventEmitter<DrawableAttribute>();

    ngAfterViewInit() {
    }

    onDrawableTypePicked(pickedType : DrawableType) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {type: pickedType}));
    }
}
