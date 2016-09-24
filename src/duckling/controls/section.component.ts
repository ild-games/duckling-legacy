import {
    Component,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';

@Component({
    selector: "dk-section-component",
    styleUrls: ['./duckling/controls/section.component.css'],
    template: `
        <md-card>
            <dk-section-header-component
                *ngIf="collapsible"
                [checkboxMode]="checkboxMode"
                [sectionOpen]="sectionOpen"
                [headerText]="headerText"
                (sectionOpenChanged)="onSectionOpenChanged($event)">
            </dk-section-header-component>
            <dk-section-header-component
                *ngIf="!collapsible"
                [headerText]="headerText"
                [checkboxMode]="false">
            </dk-section-header-component>
            <div
                class="body"
                *ngIf="isSectionOpen">
                <ng-content></ng-content>
            </div>
        </md-card>
    `
})
export class SectionComponent {
    @Input()
    collapsible : boolean = false;

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

    get isSectionOpen() {
        return this.sectionOpen || !this.collapsible;
    }
}
