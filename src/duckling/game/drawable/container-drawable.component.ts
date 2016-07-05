import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';

import {ContainerDrawable} from './container-drawable';
import {ContainerDrawableRowComponent} from './container-drawable-row.component';

@Component({
    selector: "dk-container-drawable-component",
    styleUrls: ['./duckling/game/drawable/container-drawable.component.css'],
    directives: [MD_CARD_DIRECTIVES, ContainerDrawableRowComponent],
    template: `
        <md-card>
            <dk-container-drawable-row-component
                title="Shape Drawable">
            </dk-container-drawable-row-component>
            <md-divider></md-divider>
            <dk-container-drawable-row-component
                title="Row 2">
            </dk-container-drawable-row-component>
        </md-card>
    `
})
export class ContainerDrawableComponent {
    @Input() containerDrawable : ContainerDrawable;
    @Output() drawableChanged = new EventEmitter<ContainerDrawable>();
}
