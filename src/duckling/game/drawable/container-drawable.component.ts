import {
    Component,
    Input,
    Output,
    EventEmitter,
    forwardRef
} from '@angular/core';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';

import {AccordianElement, FormLabel, EnumChoiceComponent} from '../../controls';
import {immutableAssign, immutableArrayAssign} from '../../util';


import {ContainerDrawable} from './container-drawable';
import {getDefaultDrawable, DrawableComponent} from './drawable.component';
import {Drawable, DrawableType} from './drawable';

/**
 * Component used to edit a Container Drawable including all its children drawables
 */
@Component({
    selector: "dk-container-drawable-component",
    styleUrls: ['./duckling/game/drawable/container-drawable.component.css'],
    directives: [
        MD_CARD_DIRECTIVES,
        AccordianElement,
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
            <div *ngFor="let key of keys()">
                <dk-accordian-element
                    [title]="containerDrawable?.drawables[key].key"
                    [opened]="cardsOpen[key]"
                    [first]="firstChildDrawable(key)"
                    [last]="lastChildDrawable(key)"
                    (deleted)="onChildCardDeleted(key, $event)"
                    (toggled)="onChildCardToggled(key, $event)"
                    (moved)="onChildCardMoved(key, $event)">
                    <dk-drawable-component
                        [drawable]="containerDrawable?.drawables[key]"
                        (drawableChanged)="onChildDrawableChanged(key, $event)">
                    </dk-drawable-component>
                </dk-accordian-element>
            </div>
        </md-card>
    `
})
export class ContainerDrawableComponent {
    // hoist DrawableType so template can access it
    DrawableType = DrawableType;

    @Input() containerDrawable : ContainerDrawable;
    @Output() drawableChanged = new EventEmitter<ContainerDrawable>();
    cardsOpen : boolean[] = [];

    onChildDrawableChanged(index : number, newDrawable : Drawable) {
        var head = this.containerDrawable.drawables.slice(0, index);
        var tail = this.containerDrawable.drawables.slice(index + 1, this.containerDrawable.drawables.length);
        var patch : Drawable[] = head.concat([newDrawable]).concat(tail);
        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {drawables: patch}));
    }

    onChildCardDeleted(index : number, deleted : boolean) {
        if (!deleted) {
            return;
        }
        var head = this.containerDrawable.drawables.slice(0, index);
        var tail = this.containerDrawable.drawables.slice(index + 1, this.containerDrawable.drawables.length);
        var patch : Drawable[] = head.concat(tail);
        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {drawables: patch}));
    }

    onChildCardToggled(index : number, opened : boolean) {
        this.cardsOpen[index] = opened;
    }

    onChildCardMoved(index : number, down : boolean) {
        if (down) {
            this._onChildCardMovedDown(index);
        } else {
            this._onChildCardMovedUp(index);
        }
    }

    _onChildCardMovedDown(index : number) {
        let patch : Drawable[] = [];
        let head = this.containerDrawable.drawables.slice(0, index);
        let tail = this.containerDrawable.drawables.slice(index + 2, this.containerDrawable.drawables.length);
        patch = immutableArrayAssign(
            patch,
            head.concat([this.containerDrawable.drawables[index + 1], this.containerDrawable.drawables[index]]).concat(tail));

        var bankedOpened = this.cardsOpen[index + 1];
        this.cardsOpen[index + 1] = this.cardsOpen[index];
        this.cardsOpen[index] = bankedOpened;

        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {drawables: patch}));
    }

    _onChildCardMovedUp(index : number) {
        let patch : Drawable[] = []
        let head = this.containerDrawable.drawables.slice(0, index - 1);
        let tail = this.containerDrawable.drawables.slice(index + 1, this.containerDrawable.drawables.length);
        patch = immutableArrayAssign(
            patch,
            head.concat([this.containerDrawable.drawables[index], this.containerDrawable.drawables[index - 1]]).concat(tail));

        var bankedOpened = this.cardsOpen[index - 1];
        this.cardsOpen[index - 1] = this.cardsOpen[index];
        this.cardsOpen[index] = bankedOpened;

        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {drawables: patch}));
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
            if (drawable.type === pickedType) {
                var keyNum : number = +drawable.key.substr(drawable.key.length - 1, drawable.key.length);
                if (keyNum > lastKey) {
                    lastKey = keyNum;
                }
            }
        }
        return ++lastKey;
    }

    keys() {
        if (!this.containerDrawable) {
            return [];
        }

        var keys = new Array(this.containerDrawable.drawables.length);
        for (var i = 0; i < keys.length; i++) {
            keys[i] = i;
        }
        return keys;
    }

    firstChildDrawable(index : number) : boolean {
        return index === 0;
    }

    lastChildDrawable(index : number) : boolean {
        return index === this.containerDrawable.drawables.length - 1;
    }
}
