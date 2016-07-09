import {
    Component,
    Input,
    Output,
    EventEmitter,
    ContentChild,
    TemplateRef,
    Directive,
    ViewContainerRef
} from '@angular/core';

import {immutableAssign, immutableArrayAssign} from '../util';

import {AccordianElement} from './accordian-element.component';

@Directive({
    selector: '[ngElementWrapper]'
})
export class NgElementWrapper {
    @Input() wrappedElement : any;
    @Input() index : any;

    constructor(private _viewContainer : ViewContainerRef) {
    }

    @Input() set ngElementWrapper(templateRef : TemplateRef<any>) {
        let embeddedViewRef = this._viewContainer.createEmbeddedView(templateRef);
        embeddedViewRef.context.element = this.wrappedElement;
        embeddedViewRef.context.index = this.index;
    }
}

@Component({
    selector: "dk-accordian",
    directives: [AccordianElement, NgElementWrapper],
    template: `
        <div *ngFor="let index of indices()">
            <dk-accordian-element
                [title]="elements[index][titleProperty]"
                [opened]="sleevesOpen[index]"
                [first]="index === 0"
                [last]="index === elements.length - 1"
                (deleted)="onElementDeleted(index, $event)"
                (toggled)="onElementToggled(index, $event)"
                (moved)="onElementMoved(index, $event)">

                <template
                    [ngElementWrapper]="elementTemplate"
                    [index]="index"
                    [wrappedElement]="elements[index]">
                </template>
            </dk-accordian-element>
        </div>
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
        var head = this.elements.slice(0, index);
        var tail = this.elements.slice(index + 1, this.elements.length);
        var patch : T[] = head.concat(tail);
        this.elementDeleted.emit(immutableArrayAssign(this.elements, patch));
    }

    onElementToggled(index : number, opened : boolean) {
        this.sleevesOpen[index] = opened;
    }

    onElementMoved(index : number, down : boolean) {
        if (down) {
            this._onElementMovedDown(index);
        } else {
            this._onElementMovedUp(index);
        }
    }

    _onElementMovedDown(index : number) {
        let patch : T[] = [];
        let head = this.elements.slice(0, index);
        let tail = this.elements.slice(index + 2, this.elements.length);
        patch = immutableArrayAssign(
            patch,
            head.concat([this.elements[index + 1], this.elements[index]]).concat(tail));

        var bankedOpened = this.sleevesOpen[index + 1];
        this.sleevesOpen[index + 1] = this.sleevesOpen[index];
        this.sleevesOpen[index] = bankedOpened;

        this.elementMovedDown.emit(immutableArrayAssign(this.elements, patch));
    }

    _onElementMovedUp(index : number) {
        let patch : T[] = []
        let head = this.elements.slice(0, index - 1);
        let tail = this.elements.slice(index + 1, this.elements.length);
        patch = immutableArrayAssign(
            patch,
            head.concat([this.elements[index], this.elements[index - 1]]).concat(tail));

        var bankedOpened = this.sleevesOpen[index - 1];
        this.sleevesOpen[index - 1] = this.sleevesOpen[index];
        this.sleevesOpen[index] = bankedOpened;

        this.elementMovedUp.emit(immutableArrayAssign(this.elements, patch));
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
