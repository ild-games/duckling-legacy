import {
    Component,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';

import {AccordianComponent, FormLabelComponent, EnumChoiceComponent} from '../../controls';
import {immutableAssign, immutableArrayAssign} from '../../util';


import {ContainerDrawable} from './container-drawable';
import {getDefaultDrawable, DrawableComponent} from './drawable.component';
import {Drawable, DrawableType, drawableTypeToCppType} from './drawable';

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

        <md-card
            *ngIf="containerDrawable?.drawables?.length > 0"
            class="drawables-card">
            <dk-accordian
                [elements]="containerDrawable?.drawables"
                titleProperty="key"
                keyProperty="key"
                (elementDeleted)="onChildDrawablesChanged($event)"
                (elementMovedDown)="onChildDrawablesChanged($event)"
                (elementMovedUp)="onChildDrawablesChanged($event)">
                <template let-element="$element" let-index="$index">
                    <dk-drawable
                        [drawable]="element"
                        (drawableChanged)="onChildDrawableChanged(index, $event)">
                    </dk-drawable>
                </template>
            </dk-accordian>
        </md-card>
    `
})
export class ContainerDrawableComponent {
    // hoist DrawableType so template can access it
    DrawableType = DrawableType;

    @Input() containerDrawable : ContainerDrawable;
    @Output() drawableChanged = new EventEmitter<ContainerDrawable>();

    onChildDrawableChanged(index : number, newDrawable : Drawable) {
        let newChildren = this.containerDrawable.drawables.slice(0);
        newChildren[index] = newDrawable;
        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {drawables: newChildren}));
    }

    onChildDrawablesChanged(newDrawables : Drawable[]) {
        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {drawables: newDrawables}));
    }

    onNewDrawableClicked(pickedType : DrawableType) {
        let defaultDrawable = getDefaultDrawable(pickedType);
        let newDrawable = immutableAssign(defaultDrawable, {key: defaultDrawable.key + this.findNextUniqueKey(pickedType, defaultDrawable.key)});
        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {
            drawables: this.containerDrawable.drawables.concat(newDrawable)
        }));
    }

    findNextUniqueKey(pickedType : DrawableType, defaultKey : string) {
        let lastKey = 0;
        for (let drawable of this.containerDrawable.drawables) {
            if (drawable.__cpp_type === drawableTypeToCppType(pickedType)) {
                let keyNum : number = +drawable.key.split(defaultKey)[1];
                if (keyNum > lastKey) {
                    lastKey = keyNum;
                }
            }
        }
        return ++lastKey;
    }
}
