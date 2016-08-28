import {
    Component,
    Input,
    Output,
    EventEmitter,
    ContentChild,
    TemplateRef,
    SimpleChange
} from '@angular/core';

import {immutableAssign, immutableArrayAssign, immutableArrayDelete, immutableSwapElements} from '../util';

import {AccordianElement} from './accordian-element.component';
import {TemplateWrapper} from './template-wrapper';

@Component({
    selector: "dk-accordian",
    directives: [AccordianElement, TemplateWrapper],
    template: `
        <dk-accordian-element
            *ngFor="let index of indices()"
            [title]="elements[index][titleProperty]"
            [opened]="openedElements[keyForIndex(index)]"
            [first]="index === 0"
            [last]="index === elements.length - 1"
            [clone]="clone"
            (deleted)="onElementDeleted(index, $event)"
            (toggled)="onElementToggled(index, $event)"
            (cloned)="onElementCloned(index)"
            (moved)="onElementMoved(index, $event)">
            <template
                [templateWrapper]="elementTemplate"
                [context]="elementContext(index)">
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
     * The property on the element that is used to uniquely identify the element
     */
    @Input() keyProperty : string;
    /**
     * Whether the accordian can clone its elements.
     */
    @Input() clone : boolean;
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
     * Function emitted when an element has been cloned to the bottom of the accordian
     */
    @Output() elementCloned = new EventEmitter<T[]>();

    /**
     * Keeps track of what elements are currently opened
     */
    openedElements : {[key : string] : boolean} = {};

    onElementDeleted(index : number, deleted : boolean) {
        if (!deleted) {
            return;
        }
        this.elementDeleted.emit(immutableArrayDelete(this.elements, index));
    }

    onElementToggled(index : number, opened : boolean) {
        this.openedElements[this.keyForIndex(index)] = opened;
    }

    onElementMoved(index : number, down : boolean) {
        let newIndex : number = down ? index + 1 : index - 1;
        if (down) {
            this.elementMovedDown.emit(immutableSwapElements(this.elements, index, newIndex));
        } else {
            this.elementMovedUp.emit(immutableSwapElements(this.elements, index, newIndex));
        }
    }

    onElementCloned(index : number) {
        this.elementCloned.emit(immutableArrayAssign(this.elements, this.elements.concat(this.elements[index])));
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

    elementContext(index : number) {
        return {
            $index: index,
            $element : this.elements[index]
        }
    }

    keyForIndex(index : number) : string {
        let element : any = this.elements[index];
        return element[this.keyProperty] as string;
    }
}
