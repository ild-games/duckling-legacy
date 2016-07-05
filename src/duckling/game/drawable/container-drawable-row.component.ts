import {
    Component,
    Input,
    Output,
    EventEmitter,
    forwardRef
} from '@angular/core';
import {MD_BUTTON_DIRECTIVES} from '@angular2-material/button';

import {immutableAssign} from '../../util';

import {DrawableComponent} from './drawable.component';
import {DrawableAttribute} from './drawable-attribute';
import {ShapeDrawable} from './shape-drawable';
import {DrawableType} from './drawable';

@Component({
    selector: "dk-container-drawable-row-component",
    directives: [MD_BUTTON_DIRECTIVES, forwardRef(() => DrawableComponent)],
    styleUrls: ['./duckling/game/drawable/container-drawable-row.component.css'],
    template: `
        <button
            *ngIf="!opened"
            md-button
            class="row-header-button"
            (click)="openPane()">
            <span
                class="oi"
                attr.data-glyph="{{'caret-right'}}">
            </span>
        </button>
        <button
            *ngIf="opened"
            md-button
            class="row-header-button"
            (click)="closePane()">
            <span
                class="oi"
                attr.data-glyph="{{'caret-bottom'}}">
            </span>
        </button>
        {{title}}
        <div class="arrow-buttons">
            <button
                md-button
                class="row-header-button">
                <span
                    class="oi"
                    attr.data-glyph="{{'arrow-thick-top'}}">
                </span>
            </button>
            <button
                md-button
                class="row-header-button">
                <span
                    class="oi"
                    attr.data-glyph="{{'arrow-thick-bottom'}}">
                </span>
            </button>
        </div>
        <div *ngIf="opened" class="row-contents">
            <dk-drawable-component
                [attribute]="testDrawable"
                (attributeChanged)="onChildAttributeChanged($event)">
            </dk-drawable-component>
        </div>
    `
})
export class ContainerDrawableRowComponent {
    @Input() title : string;

    opened = false;

    testDrawable : DrawableAttribute = {
        topDrawable: {
            type: null,
            renderPriority: 0,
            scale: {
                x: 1,
                y: 1
            },
            rotation: 0,
            bounds: {
                x: 0,
                y: 0
            }
        }
    }

    openPane() {
        this.opened = true;
    }

    closePane() {
        this.opened = false;
    }

    onChildAttributeChanged(newAttribute : DrawableAttribute) {
        this.testDrawable = newAttribute;
    }
}
