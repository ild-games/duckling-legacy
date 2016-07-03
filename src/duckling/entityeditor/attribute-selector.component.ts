import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges
} from '@angular/core';

import {ArraySelect, SelectOption} from '../controls';
import {Entity, AvailableAttributeService, AttributeKey} from '../entitysystem';
import {toTitleCase} from '../util';
import {changeType, ChangeType} from '../state';

/**
 * Allows the user to add attributes to an entity.
 */
@Component({
    selector: "dk-attribute-selector",
    directives: [ArraySelect],
    template: `
        <div *ngIf="options.length">
            <dk-array-select
                [value]="selected"
                (selection)="select($event)"
                [options]="options">
            </dk-array-select>
            <button (click)="onAddClicked()">
                Add
            </button>
        </div>
        <div *ngIf="!options.length">
            No Other Attributes Available
        </div>
    `
})
export class AttributeSelectorComponent implements OnChanges {
    /**
     * The entity the user will add attributes to.
     */
    @Input() entity : Entity;

    /**
     * Fired when the user clicks on the add button and the attribute should be added.
     * @return {[type]} [description]
     */
    @Output() addAttribute = new EventEmitter<AttributeKey>();

    options : SelectOption[] = [];
    selection : AttributeKey = "";

    constructor(private _availableAttribute : AvailableAttributeService) {

    }

    onAddClicked() {
        if (this.selection) {
            this.addAttribute.emit(this.selection);
        }
    }

    select(key : AttributeKey) {
        this.selection = key;
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
