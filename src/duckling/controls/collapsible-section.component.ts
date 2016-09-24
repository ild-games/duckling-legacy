import {
    Component,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';

@Component({
    selector: "dk-collapsible-section",
    styleUrls: ['./duckling/controls/collapsible-section.component.css'],
    template: `
        <md-card>
            <dk-section-header-component
                [checkboxMode]="checkboxMode"
                [sectionOpen]="sectionOpen"
                [headerText]="headerText"
                (sectionOpenChanged)="onSectionOpenChanged($event)">
            </dk-section-header-component>
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
}
