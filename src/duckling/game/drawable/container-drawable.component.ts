import {
    Component,
    Input,
    Output,
    EventEmitter,
    forwardRef
} from '@angular/core';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';

import {Accordian, FormLabel, EnumChoiceComponent} from '../../controls';
import {immutableAssign, immutableArrayAssign} from '../../util';


import {ContainerDrawable} from './container-drawable';
import {getDefaultDrawable, DrawableComponent} from './drawable.component';
import {Drawable, DrawableType, typeToCppType} from './drawable';

/**
 * Component used to edit a Container Drawable including all its children drawables
 */
@Component({
    selector: "dk-container-drawable-component",
    styleUrls: ['./duckling/game/drawable/container-drawable.component.css'],
    directives: [
        MD_CARD_DIRECTIVES,
        Accordian,
        FormLabel,
        EnumChoiceComponent,
        forwardRef(() => DrawableComponent)],
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
                    <dk-drawable-component
                        [drawable]="element"
                        (drawableChanged)="onChildDrawableChanged(index, $event)">
                    </dk-drawable-component>
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
        let head = this.containerDrawable.drawables.slice(0, index);
        let tail = this.containerDrawable.drawables.slice(index + 1, this.containerDrawable.drawables.length);
        let patch : Drawable[] = head.concat([newDrawable]).concat(tail);
        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {drawables: patch}));
    }

    onChildDrawablesChanged(newDrawables : Drawable[]) {
        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {drawables: newDrawables}));
    }

    onNewDrawableClicked(pickedType : DrawableType) {
        var defaultDrawable = getDefaultDrawable(pickedType);
        var newDrawable = immutableAssign(defaultDrawable, {key: defaultDrawable.key + this.findNextUniqueKey(pickedType)});
        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {
            drawables: this.containerDrawable.drawables.concat(newDrawable)
        }));
    }

    findNextUniqueKey(pickedType : DrawableType) {
        var lastKey = 0;
        for (let drawable of this.containerDrawable.drawables) {
            if (drawable.__cpp_type === typeToCppType(pickedType)) {
                var keyNum : number = +drawable.key.substr(drawable.key.length - 1, drawable.key.length);
                if (keyNum > lastKey) {
                    lastKey = keyNum;
                }
            }
        }
        return ++lastKey;
    }
}
