import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "dk-section",
  styleUrls: ["./duckling/controls/section.component.css"],
  template: `
        <mat-card>
            <dk-section-header
                *ngIf="collapsible"
                [checkboxMode]="checkboxMode"
                [collapsible]="collapsible"
                [sectionOpen]="sectionOpen"
                [headerText]="headerText"
                (sectionOpenChanged)="onSectionOpenChanged($event)">
            </dk-section-header>
            <dk-section-header
                *ngIf="!collapsible"
                [collapsible]="false"
                [headerText]="headerText"
                [checkboxMode]="false">
            </dk-section-header>
            <div
                class="body"
                *ngIf="isSectionOpen">
                <ng-content></ng-content>
            </div>
        </mat-card>
    `
})
export class SectionComponent {
  @Input() collapsible: boolean = false;

  @Input() checkboxMode: boolean = false;

  @Input() sectionOpen: boolean = false;

  @Input() headerText: string = "";

  @Output() sectionOpenChanged = new EventEmitter<boolean>();

  onSectionOpenChanged(sectionOpened: boolean) {
    this.sectionOpenChanged.emit(sectionOpened);
  }

  get isSectionOpen() {
    return this.sectionOpen || !this.collapsible;
  }
}
