import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
    AfterViewInit
} from '@angular/core';

import {ArrayChoiceComponent, SelectOption} from '../controls';
import {Entity, AvailableAttributeService, AttributeKey} from '../entitysystem';
import {toTitleCase} from '../util';
import {changeType, ChangeType} from '../state';

/**
 * Allows the user to add attributes to an entity.
 */
@Component({
    selector: "dk-attribute-selector",
    template: `
        <div *ngIf="options.length">
            <dk-array-choice
                [options]="options"
                [selected]="selection"
                (addClicked)="onAddClicked($event)">
            </dk-array-choice>
        </div>
    `
})
export class AttributeSelectorComponent implements OnChanges, AfterViewInit {
    /**
     * The entity the user will add attributes to.
     */
    @Input() entity : Entity;

    /**
     * Fired when the user clicks on the add button and the attribute should be added.
     * @return {[type]} [description]
     */
    @Output() addAttribute = new EventEmitter<AttributeKey>();

    selection : string;
    options : SelectOption[] = [];

    constructor(private _availableAttribute : AvailableAttributeService) {
    }

    ngAfterViewInit() {
        if (this.options[0]) {
            this.selection = this.options[0].value;
        }
    }

    onAddClicked(selection : string) {
        this.selection = selection;
        this.addAttribute.emit(this.selection);
    }

    newOptions() : SelectOption[] {
        return this._availableAttribute.availableAttributes(this.entity).map(key => {
            return {title: toTitleCase(key), value: key};
        });
    }

    ngOnChanges() {
        var newOptions = this.newOptions();
        newOptions.sort((left, right) => left.title.localeCompare(right.title));
        if (changeType(newOptions, this.options) !== ChangeType.Equal) {
            this.options = newOptions;
            this.selection = this._getDefaultSelection(this.options);
        }
    }

    private _getDefaultSelection(options : SelectOption[]) {
        if (options.length > 0) {
            return options[0].value;
        } else {
            return "";
        }
    }
}
