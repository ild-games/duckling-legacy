import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {MD_BUTTON_DIRECTIVES} from '@angular2-material/button';

import {immutableAssign} from '../util';

import {Icon} from './icon.component';

/**
 * Component used as a movable, deletable, expandable card element in a list.
 */
@Component({
    selector: "dk-card-list-element",
    directives: [Icon, MD_BUTTON_DIRECTIVES],
    styleUrls: ['./duckling/controls/card-list-element.component.css'],
    template: `
        <button
            *ngIf="!opened"
            md-button
            class="row-header-button"
            (click)="onToggle(true)">
            <dk-icon iconKey="caret-right"></dk-icon>
        </button>
        <button
            *ngIf="opened"
            md-button
            class="row-header-button"
            (click)="onToggle(false)">
            <dk-icon iconKey="caret-bottom"></dk-icon>
        </button>
        {{title}}
        <div class="arrow-buttons">
            <button
                *ngIf="!first"
                md-button
                class="row-header-button"
                (click)="onMoved(false)">
                <dk-icon iconKey="arrow-thick-top"></dk-icon>
            </button>
            <button
                *ngIf="!last"
                md-button
                class="row-header-button"
                (click)="onMoved(true)">
                <dk-icon iconKey="arrow-thick-bottom"></dk-icon>
            </button>
            <button
                md-button
                class="row-header-button"
                (click)="onDelete()">
                <dk-icon iconKey="x"></dk-icon>
            </button>
        </div>
        <ng-content *ngIf="opened"></ng-content>
    `
})
export class CardListElementComponent {
    @Input() title : string;
    @Input() first : boolean;
    @Input() last : boolean;
    @Input() opened = false;
    @Output() deleted = new EventEmitter<boolean>();
    @Output() moved = new EventEmitter<boolean>();
    @Output() toggled = new EventEmitter<boolean>();

    onToggle(opened : boolean) {
        this.opened = opened;
        this.toggled.emit(opened);
    }

    onDelete() {
        this.deleted.emit(true);
    }

    onMoved(down : boolean) {
        this.moved.emit(down);
    }
}
