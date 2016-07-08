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
        <div
            class="header md-elevation-z3"
            (click)="onToggle(!opened)">
            <span class="title">{{title}}</span>
            <div class="arrow-buttons">
                <button
                    md-button
                    *ngIf="!first"
                    class="row-header-button toggle-visibility"
                    (click)="onMoved(false, $event)">
                    <dk-icon iconClass="arrow-up"></dk-icon>
                </button>
                <button
                    md-button
                    *ngIf="!last"
                    class="row-header-button toggle-visibility"
                    (click)="onMoved(true, $event)">
                    <dk-icon iconClass="arrow-down"></dk-icon>
                </button>
                <button
                    md-button
                    class="row-header-button toggle-visibility"
                    (click)="onDelete($event)">
                    <dk-icon iconClass="trash"></dk-icon>
                </button>
                <dk-icon
                    *ngIf="!opened"
                    class="row-header-button"
                    iconClass="plus-circle">
                </dk-icon>
                <dk-icon
                    *ngIf="opened"
                    class="row-header-button"
                    iconClass="minus-circle">
                </dk-icon>
            </div>
        </div>
        <div *ngIf="opened" class="body">
            <ng-content></ng-content>
        </div>
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

    onDelete(event : MouseEvent) {
        event.stopPropagation();
        this.deleted.emit(true);
    }

    onMoved(down : boolean, event : MouseEvent) {
        event.stopPropagation();
        this.moved.emit(down);
    }
}
