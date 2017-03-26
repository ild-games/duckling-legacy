import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {immutableAssign} from '../../util';

import {DrawableAttribute} from './drawable-attribute';
import {Drawable} from './drawable';
import {DrawableComponent} from './drawable.component';

/**
 * Top level component for the drawable attribute
 */
@Component({
    selector: "dk-drawable-attribute",
    template: `
        <dk-input
            label="Camera Entity (blank for default)"
            [value]="attribute.camEntity"
            (inputChanged)="onCamEntityInput($event)">
        </dk-input>
        
        <dk-drawable
            [drawable]="attribute.topDrawable"
            (drawableChanged)="onDrawableChanged($event)">
        </dk-drawable>
    `
})
export class DrawableAttributeComponent {
    @Input() attribute : DrawableAttribute;
    @Output() attributeChanged = new EventEmitter<DrawableAttribute>();
    
    onCamEntityInput(newCamEntity : string) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {camEntity: newCamEntity}));
    }

    onDrawableChanged(newDrawable : Drawable) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {topDrawable: newDrawable}));
    }
}
