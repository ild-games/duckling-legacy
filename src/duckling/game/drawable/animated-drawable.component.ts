import {
    Component,
    Input,
    Output,
    EventEmitter,
    forwardRef,
    AfterViewInit
} from '@angular/core';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';

import {Accordian, FormLabel, EnumChoiceComponent, NumberInput} from '../../controls';
import {immutableAssign, immutableArrayAssign} from '../../util';


import {AnimatedDrawable} from './animated-drawable';
import {getDefaultDrawable, DrawableComponent} from './drawable.component';
import {Drawable, DrawableType, typeToCppType} from './drawable';

/**
 * Component used to edit an Aniamted Drawable including all its children drawables
 */
@Component({
    selector: "dk-animated-drawable-component",
    styleUrls: ['./duckling/game/drawable/animated-drawable.component.css'],
    directives: [
        MD_CARD_DIRECTIVES,
        Accordian,
        FormLabel,
        EnumChoiceComponent,
        NumberInput,
        forwardRef(() => DrawableComponent)],
    template: `
        <dk-number-input
            label="Duration"
            [value]="animatedDrawable.duration"
            (validInput)="onDurationChanged($event)">
        </dk-number-input>

        <dk-form-label title="Add Frame"></dk-form-label>
        <dk-enum-choice
            [enum]="DrawableType"
            [selected]="DrawableType.Shape"
            (addClicked)="onNewDrawableClicked($event)">
        </dk-enum-choice>

        <md-card
            *ngIf="animatedDrawable?.frames?.length > 0"
            class="drawables-card">
            <dk-accordian
                [elements]="animatedDrawable?.frames"
                titleProperty="key"
                (elementDeleted)="onChildDrawablesChanged($event)"
                (elementMovedDown)="onChildDrawablesChanged($event)"
                (elementMovedUp)="onChildDrawablesChanged($event)">
                <template let-drawable="element" let-index="index">
                    <dk-drawable-component
                        [drawable]="drawable"
                        (drawableChanged)="onChildDrawableChanged(index, $event)">
                    </dk-drawable-component>
                </template>
            </dk-accordian>
        </md-card>
    `
})
export class AnimatedDrawableComponent implements AfterViewInit {
    // hoist DrawableType so template can access it
    DrawableType = DrawableType;

    @Input() animatedDrawable : AnimatedDrawable;
    @Output() drawableChanged = new EventEmitter<AnimatedDrawable>();

    ngAfterViewInit() {
        setInterval(() => {
            this.nextFrame();
        }, this.animatedDrawable.duration * 1000)
    }

    onChildDrawableChanged(index : number, newDrawable : Drawable) {
        let head = this.animatedDrawable.frames.slice(0, index);
        let tail = this.animatedDrawable.frames.slice(index + 1, this.animatedDrawable.frames.length);
        let patch : Drawable[] = head.concat([newDrawable]).concat(tail);
        this.drawableChanged.emit(immutableAssign(this.animatedDrawable, {frames: patch}));
    }

    onChildDrawablesChanged(newDrawables : Drawable[]) {
        this.drawableChanged.emit(immutableAssign(this.animatedDrawable, {frames: newDrawables}));
    }

    onNewDrawableClicked(pickedType : DrawableType) {
        let defaultDrawable = getDefaultDrawable(pickedType);
        let newDrawable = immutableAssign(defaultDrawable, {key: defaultDrawable.key + this.findNextUniqueKey(pickedType)});
        this.drawableChanged.emit(immutableAssign(this.animatedDrawable, {
            frames: this.animatedDrawable.frames.concat(newDrawable)
        }));
    }

    onDurationChanged(newDuration : number) {
        this.drawableChanged.emit(immutableAssign(this.animatedDrawable, {duration: newDuration}));
    }

    findNextUniqueKey(pickedType : DrawableType) {
        let lastKey = 0;
        for (let drawable of this.animatedDrawable.frames) {
            if (drawable.__cpp_type === typeToCppType(pickedType)) {
                var keyNum : number = +drawable.key.substr(drawable.key.length - 1, drawable.key.length);
                if (keyNum > lastKey) {
                    lastKey = keyNum;
                }
            }
        }
        return ++lastKey;
    }

    nextFrame() {
        this.animatedDrawable.curFrame++;
        if (this.animatedDrawable.curFrame >= this.animatedDrawable.frames.length) {
            this.animatedDrawable.curFrame = 0;
        }
        this.drawableChanged.emit(this.animatedDrawable);
    }
}
