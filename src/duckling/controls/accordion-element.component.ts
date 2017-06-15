import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {immutableAssign} from '../util';

import {IconComponent} from './icon.component';

/**
 * Component used as an element within an accordion
 */
@Component({
    selector: "dk-accordion-element",
    styleUrls: ['./duckling/controls/accordion-element.component.css'],
    template: `
        <dk-section-header
            [sectionOpen]="opened"
            [headerText]="title"
            (sectionOpenChanged)="onToggle(!opened)">
            <button
                md-button
                *ngIf="clone"
                class="display-on-hover"
                title="Copy"
                [disableRipple]=true
                (click)="onCloned(false, $event)">
                <dk-icon iconClass="clone"></dk-icon>
            </button>
            <button
                md-button
                *ngIf="!first"
                class="display-on-hover"
                title="Move up"
                [disableRipple]=true
                (click)="onMoved(false, $event)">
                <dk-icon iconClass="arrow-up"></dk-icon>
            </button>
            <button
                md-button
                *ngIf="!last"
                class="display-on-hover"
                title="Move down"
                [disableRipple]=true
                (click)="onMoved(true, $event)">
                <dk-icon iconClass="arrow-down"></dk-icon>
            </button>
            <button
                md-button
                class="display-on-hover"
                title="Delete"
                [disableRipple]=true
                (click)="onDelete($event)">
                <dk-icon iconClass="trash"></dk-icon>
            </button>
            <dk-icon
                *ngIf="!opened"
                iconClass="chevron-down">
            </dk-icon>
            <dk-icon
                *ngIf="opened"
                iconClass="chevron-up">
            </dk-icon>
        </dk-section-header>
        <div *ngIf="opened" class="body">
            <ng-content></ng-content>
        </div>
    `
})
export class AccordionElementComponent {
    @Input() title : string;
    @Input() first : boolean;
    @Input() last : boolean;
    @Input() opened = false;
    @Input() clone = false;
    @Output() deleted = new EventEmitter<boolean>();
    @Output() moved = new EventEmitter<boolean>();
    @Output() cloned = new EventEmitter();
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

    onCloned() {
        event.stopPropagation();
        this.cloned.emit(true);
    }
}
