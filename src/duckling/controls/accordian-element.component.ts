import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {immutableAssign} from '../util';

import {Icon} from './icon.component';

/**
 * Component used as an element within an accordian
 */
@Component({
    selector: "dk-accordian-element",
    directives: [Icon],
    styleUrls: ['./duckling/controls/accordian-element.component.css'],
    template: `
        <div
            class="header md-elevation-z3"
            (click)="onToggle(!opened)">
            <span class="title">{{title}}</span>
            <div class="right-buttons">
                <button
                    md-button
                    *ngIf="!first"
                    class="display-on-hover"
                    (click)="onMoved(false, $event)">
                    <dk-icon iconClass="arrow-up"></dk-icon>
                </button>
                <button
                    md-button
                    *ngIf="!last"
                    class="display-on-hover"
                    (click)="onMoved(true, $event)">
                    <dk-icon iconClass="arrow-down"></dk-icon>
                </button>
                <button
                    md-button
                    class="display-on-hover"
                    (click)="onDelete($event)">
                    <dk-icon iconClass="trash"></dk-icon>
                </button>
                <dk-icon
                    *ngIf="!opened"
                    iconClass="plus-circle">
                </dk-icon>
                <dk-icon
                    *ngIf="opened"
                    iconClass="minus-circle">
                </dk-icon>
            </div>
        </div>
        <div *ngIf="opened" class="body">
            <ng-content></ng-content>
        </div>
    `
})
export class AccordianElement {
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
