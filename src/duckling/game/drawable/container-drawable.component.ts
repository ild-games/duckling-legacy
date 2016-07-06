import {
    Component,
    Input,
    Output,
    EventEmitter,
    forwardRef
} from '@angular/core';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';

import {CardListElementComponent, FormLabel, EnumChoiceComponent} from '../../controls';
import {immutableAssign} from '../../util';


import {ContainerDrawable} from './container-drawable';
import {getDefaultDrawable, DrawableComponent} from './drawable.component';
import {Drawable, DrawableType} from './drawable';

@Component({
    selector: "dk-container-drawable-component",
    styleUrls: ['./duckling/game/drawable/container-drawable.component.css'],
    directives: [
        MD_CARD_DIRECTIVES,
        CardListElementComponent,
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

        <div class="drawables-card">
            <div *ngFor="let key of keys()">
                <dk-card-list-element
                    [title]="containerDrawable?.drawables[key].key"
                    [opened]="cardsOpen[key]"
                    [first]="key === 0"
                    [last]="key === containerDrawable?.drawables.length - 1"
                    (deleted)="onChildCardDeleted(key, $event)"
                    (toggled)="onChildCardToggled(key, $event)"
                    (moved)="onChildCardMoved(key, $event)">
                    <dk-drawable-component
                        [drawable]="containerDrawable?.drawables[key]"
                        (drawableChanged)="onChildDrawableChanged(key, $event)">
                    </dk-drawable-component>
                </dk-card-list-element>
                <md-divider *ngIf="key !== containerDrawable?.drawables.length - 1"></md-divider>
            </div>
        </div>
    `
})
export class ContainerDrawableComponent {
    // hoist DrawableType so template can access it
    DrawableType = DrawableType;

    @Input() containerDrawable : ContainerDrawable;
    @Output() drawableChanged = new EventEmitter<ContainerDrawable>();
    cardsOpen : boolean[] = [];

    onChildDrawableChanged(index : number, newDrawable : Drawable) {
        var patch = this.containerDrawable.drawables;
        patch[index] = newDrawable;
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
        var newIndex = index + (down ? 1 : -1);
        var patch = this.containerDrawable.drawables;
        var bankedItem = patch[newIndex];
        patch[newIndex] = patch[index];
        patch[index] = bankedItem;

        var bankedOpened = this.cardsOpen[newIndex];
        this.cardsOpen[newIndex] = this.cardsOpen[index];
        this.cardsOpen[index] = bankedOpened;

        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {drawables: patch}));
    }

    onNewDrawableClicked(pickedType : DrawableType) {
        this.drawableChanged.emit(immutableAssign(this.containerDrawable, {
            drawables: this.containerDrawable.drawables.concat([getDefaultDrawable(pickedType)])
        }));
    }

    findNextUniqueKey(pickedType : DrawableType) {
        var lastKey = 0;
        this.containerDrawable.drawables.map((drawable) => {
            if (drawable.type === pickedType) {
                var keyNum : number = +drawable.key.substr(drawable.key.length - 1, drawable.key.length);
                if (keyNum > lastKey) {
                    lastKey = keyNum;
                }
            }
        });
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
}
