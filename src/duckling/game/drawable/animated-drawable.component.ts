import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    ViewContainerRef
} from '@angular/core';

import {AccordianComponent, FormLabelComponent, EnumChoiceComponent, NumberInputComponent} from '../../controls';
import {immutableAssign, immutableArrayAssign} from '../../util';
import {AssetService} from '../../project/asset.service';
import {Vector} from '../../math';
import {Validator} from '../../controls/validated-input.component';

import {AnimatedDrawable} from './animated-drawable';
import {ImageDrawable, defaultImageDrawable} from './image-drawable';
import {getDefaultDrawable, DrawableComponent} from './drawable.component';
import {Drawable, DrawableType, drawableTypeToCppType, cppTypeToDrawableType} from './drawable';
import {AutoCreateAnimationDialogComponent, AutoCreateDialogResult} from './auto-create-animation-dialog.component';

/**
 * Component used to edit an Aniamted Drawable including all its children drawables
 */
@Component({
    selector: "dk-animated-drawable",
    styleUrls: ['./duckling/game/drawable/animated-drawable.component.css'],
    template: `
        <dk-number-input
            label="Duration (seconds)"
            [value]="animatedDrawable.duration"
            (validInput)="onDurationChanged($event)">
        </dk-number-input>

        <dk-form-label title="Add Frame"></dk-form-label>
        <dk-enum-choice
            [enum]="DrawableType"
            [selected]="DrawableType.Shape"
            (addClicked)="onNewDrawableClicked($event)">
        </dk-enum-choice>
        <span *ngIf="!hasAnyFrames">
            OR
        </span>
        <button
            *ngIf="!hasAnyFrames"
            md-raised-button
            class="create-from-tilesheet-button"
            title="Create from tilesheet"
            disableRipple="true"
            (click)="onCreateFromTilesheetClicked()">
            Create from tilesheet
        </button>

        <md-card
            *ngIf="hasAnyFrames"
            class="drawables-card">
            <dk-accordian
                titleProperty="key"
                keyProperty="key"
                [elements]="animatedDrawable?.frames"
                [clone]="true"
                (elementDeleted)="onChildDrawablesChanged($event)"
                (elementMovedDown)="onChildDrawablesChanged($event)"
                (elementMovedUp)="onChildDrawablesChanged($event)"
                (elementCloned)="onFrameCloned($event)">
                <template let-element="$element" let-index="$index">
                    <dk-drawable
                        [drawable]="element"
                        [keyValidator]="keyValidator"
                        (drawableChanged)="onChildDrawableChanged(index, $event)">
                    </dk-drawable>
                </template>
            </dk-accordian>
        </md-card>
    `
})
export class AnimatedDrawableComponent {
    // hoist DrawableType so template can access it
    DrawableType = DrawableType;

    @Input() keyValidator : Validator;
    @Input() animatedDrawable : AnimatedDrawable;
    @Output() drawableChanged = new EventEmitter<AnimatedDrawable>();

    constructor(private _viewContainerRef : ViewContainerRef,
                private _assets : AssetService) {
    }

    onChildDrawableChanged(index : number, newDrawable : Drawable) {
        let newFrames = this.animatedDrawable.frames.slice(0);
        newFrames[index] = newDrawable;
        this.drawableChanged.emit(immutableAssign(this.animatedDrawable, {frames: newFrames}));
    }

    onChildDrawablesChanged(newDrawables : Drawable[]) {
        this.drawableChanged.emit(immutableAssign(this.animatedDrawable, {frames: newDrawables}));
    }

    onNewDrawableClicked(pickedType : DrawableType) {
        let defaultDrawable = getDefaultDrawable(pickedType);
        let newDrawable = immutableAssign(defaultDrawable, {key: defaultDrawable.key + this.findNextUniqueKey(pickedType, defaultDrawable.key)});
        this.drawableChanged.emit(immutableAssign(this.animatedDrawable, {
            frames: this.animatedDrawable.frames.concat(newDrawable)
        }));
    }

    onFrameCloned(newDrawables : Drawable[]) {
        let newFrame = newDrawables[newDrawables.length - 1];
        let newFrameType = cppTypeToDrawableType(newFrame.__cpp_type);
        let defaultKey = getDefaultDrawable(newFrameType).key;
        newFrame = immutableAssign(
            newDrawables[newDrawables.length - 1],
            {key: defaultKey + this.findNextUniqueKey(newFrameType, defaultKey)});

        this.drawableChanged.emit(immutableAssign(this.animatedDrawable, {frames: newDrawables.slice(0, newDrawables.length - 1).concat([newFrame])}));
    }

    onDurationChanged(newDuration : number) {
        this.drawableChanged.emit(immutableAssign(this.animatedDrawable, {duration: newDuration}));
    }

    onCreateFromTilesheetClicked() {
        AutoCreateAnimationDialogComponent.open(this._viewContainerRef).subscribe(result => this._autoCreateAnimationFromTilesheet(result));
    }


    private _autoCreateAnimationFromTilesheet(dialogResult : AutoCreateDialogResult) {
        if (!dialogResult || !dialogResult.imageKey) {
            return;
        }

        let frames : ImageDrawable[] = [];
        let textureWidth = this._assets.getImageAssetDimensions({key: dialogResult.imageKey, type: "TexturePNG"}).x;
        for (let curY = 0, i = 0; frames.length < dialogResult.numFrames; curY += dialogResult.frameDimensions.y) {
            for (let curX = 0; frames.length < dialogResult.numFrames && curX < textureWidth; curX += dialogResult.frameDimensions.x) {
                frames.push(immutableAssign(defaultImageDrawable, {
                    key: defaultImageDrawable.key + (i + 1),
                    isWholeImage: false,
                    textureRect: {
                        position: {
                            x: curX,
                            y: curY
                        },
                        dimension: {
                            x: dialogResult.frameDimensions.x,
                            y: dialogResult.frameDimensions.y
                        }
                    },
                    textureKey: dialogResult.imageKey
                }));
                i++;
            }
        } 
        this.drawableChanged.emit(immutableAssign(this.animatedDrawable, {frames: frames}));
    }

    findNextUniqueKey(pickedType : DrawableType, defaultKey : string) {
        let lastKey = 0;
        for (let drawable of this.animatedDrawable.frames) {
            if (drawable.__cpp_type === drawableTypeToCppType(pickedType)) {
                let keyNum : number = +drawable.key.split(defaultKey)[1];
                if (keyNum > lastKey) {
                    lastKey = keyNum;
                }
            }
        }
        return ++lastKey;
    }

    get hasAnyFrames() {
        return this.animatedDrawable && this.animatedDrawable.frames && this.animatedDrawable.frames.length > 0;
    }
}
