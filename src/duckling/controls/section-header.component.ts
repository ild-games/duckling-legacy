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
    selector: "dk-section-header",
    styleUrls: ['./duckling/controls/section-header.component.css'],
    template: `
        <div
            [class]="headerCssClasses"
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

    @Input()
    collapsible : boolean = true;

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

    get headerCssClasses() : string {
        if (this.collapsible) {
            return "header mat-elevation-z3 pointer";
        }
        return "header mat-elevation-z3";
    }
}
