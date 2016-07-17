import {
    Component,
    Input,
    Output,
    EventEmitter,
    ContentChild,
    TemplateRef
} from '@angular/core';

import {immutableArrayAssign, immutableArrayDelete, immutableSwapElements} from '../util';

import {AccordianElement} from './accordian-element.component';
import {TemplateWrapper} from './template-wrapper';

@Component({
    selector: "dk-accordian",
    directives: [AccordianElement, TemplateWrapper],
    template: `
        <dk-accordian-element
            *ngFor="let index of indices()"
            [title]="elements[index][titleProperty]"
            [opened]="sleevesOpen[index]"
            [first]="index === 0"
            [last]="index === elements.length - 1"
            (deleted)="onElementDeleted(index, $event)"
            (toggled)="onElementToggled(index, $event)"
            (moved)="onElementMoved(index, $event)">
            <template
                [templateWrapper]="elementTemplate"
                [index]="index"
                [wrappedElement]="elements[index]">
            </template>
        </dk-accordian-element>
    `
})
export class Accordian<T> {
    @ContentChild(TemplateRef) elementTemplate : TemplateRef<any>;
    /**
     * The list of elements to be displayed in the accordian
     */
    @Input() elements : T[];
    /**
     * The property on the element being displayed in the accordian used for the title
     */
    @Input() titleProperty : string;
    /**
     * Function emitted when an element has been deleted, passes the new elements array up
     */
    @Output() elementDeleted = new EventEmitter<T[]>();
    /**
     * Function emitted when an element has been moved up the accordian, passes the new elements array up
     */
    @Output() elementMovedDown = new EventEmitter<T[]>();
    /**
     * Function emitted when an element has been moved down the accordian, passes the new elements array up
     */
    @Output() elementMovedUp = new EventEmitter<T[]>();


    /**
     * Keeps track of what sleeves of the accordian are open
     */
    sleevesOpen : boolean[] = [];

    onElementDeleted(index : number, deleted : boolean) {
        if (!deleted) {
            return;
        }
        this.elementDeleted.emit(immutableArrayDelete(this.elements, index));
    }

    onElementToggled(index : number, opened : boolean) {
        this.sleevesOpen[index] = opened;
    }

    onElementMoved(index : number, down : boolean) {
        let newIndex : number = down ? index + 1 : index - 1;
        let bankedOpened = this.sleevesOpen[newIndex];
        this.sleevesOpen[newIndex] = this.sleevesOpen[index];
        this.sleevesOpen[index] = bankedOpened;

        if (down) {
            this.elementMovedDown.emit(immutableSwapElements(this.elements, index, newIndex));
        } else {
            this.elementMovedUp.emit(immutableSwapElements(this.elements, index, newIndex));
        }
    }

    indices() {
        if (!this.elements) {
            return [];
        }

        let indices = new Array(this.elements.length);
        for (var i = 0; i < indices.length; i++) {
            indices[i] = i;
        }
        return indices;
    }
}
