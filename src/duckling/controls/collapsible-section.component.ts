import {
    Component,
    Input,
    Output,
    EventEmitter,
    ContentChild,
    TemplateRef,
    SimpleChange
} from '@angular/core';

import {immutableAssign} from '../util';

import {TemplateWrapper} from './template-wrapper';

@Component({
    selector: "dk-collapsible-section-component",
    styleUrls: ['./duckling/controls/collapsible-section.component.css'],
    template: `
        <md-card>
            <div class="header md-elevation-z3">
                <dk-checkbox
                    [checked]="sectionOpen"
                    [text]="headerText"
                    (input)="onSectionOpenChanged($event)">
                </dk-checkbox>
            </div>
            <div
                class="body"
                *ngIf="sectionOpen">
                <ng-content></ng-content>
            </div>
        </md-card>
    `
})
export class CollapsibleSectionComponent {
    @Input()
    sectionOpen : boolean = false;

    @Input()
    headerText : string = "";

    @Output()
    sectionOpenChanged = new EventEmitter<boolean>();

    onSectionOpenChanged(sectionOpened : boolean) {
        this.sectionOpenChanged.emit(sectionOpened);
    }
}
