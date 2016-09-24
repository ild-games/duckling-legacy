import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

/**
 * Component for the generic header for sections
 */
@Component({
    selector: "dk-section-header-component",
    styleUrls: ['./duckling/controls/section-header.component.css'],
    template: `
        <div
            class="header md-elevation-z3"
            (click)="onWholeHeaderClicked(!sectionOpen)">
            <span
                *ngIf="!checkboxMode"
                class="title">
                {{headerText}}
            </span>
            <dk-checkbox
                *ngIf="checkboxMode"
                [checked]="sectionOpen"
                [text]="headerText"
                (input)="onSectionOpenChanged($event)">
            </dk-checkbox>
            <div class="right-content">
                <ng-content></ng-content>
            </div>
        </div>
    `
})
export class SectionHeaderComponent {
    @Input()
    checkboxMode : boolean = false;

    @Input()
    sectionOpen : boolean = false;

    @Input()
    headerText : string = "";

    @Output()
    sectionOpenChanged = new EventEmitter<boolean>();

    onSectionOpenChanged(sectionOpened : boolean) {
        this.sectionOpenChanged.emit(sectionOpened);
    }

    onWholeHeaderClicked(sectionOpened : boolean) {
        if (!this.checkboxMode) {
            this.sectionOpenChanged.emit(sectionOpened);
        }
    }
}
