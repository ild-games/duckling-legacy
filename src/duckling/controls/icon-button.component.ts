import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {IconComponent} from './icon.component';

/**
 * Component for a general purpose icon button
 */
@Component({
    selector: "dk-icon-button",
    styleUrls: ['./duckling/controls/icon-button.component.css'],
    template: `
        <button
            *ngIf="!isRaised"
            md-button
            [title]="tooltip"
            [disableRipple]=true
            [disabled]="disabled"
            [color]="color"
            (click)="onButtonClicked()">
            &nbsp;
            <dk-icon [iconClass]="icon"></dk-icon>
            &nbsp;
        </button>
        <button
            *ngIf="isRaised"
            md-raised-button
            [title]="tooltip"
            [disableRipple]=true
            [disabled]="disabled"
            [color]="color"
            (click)="onButtonClicked()">
            &nbsp;
            <dk-icon [iconClass]="icon"></dk-icon>
            &nbsp;
        </button>
    `
})
export class IconButtonComponent {
    @Input() icon : string = "";
    @Input() color : string = "";
    @Input() tooltip : string = "";
    @Input() isRaised : boolean = false;
    @Input() disabled : boolean = false;
    @Output() iconClick = new EventEmitter<boolean>();

    onButtonClicked() {
        this.iconClick.emit(true);
    }
}
