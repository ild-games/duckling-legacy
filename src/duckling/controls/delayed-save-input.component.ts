import {
    Component,
    Input,
    Output,
    EventEmitter,
    SimpleChange,
    OnChanges,
    OnInit
} from '@angular/core';

import {Validator} from './validated-input.component';

import {DeleteButtonComponent, InputComponent} from '../controls';

@Component({
    selector: "dk-delayed-save-input",
    styleUrls: ['./duckling/controls/delayed-save-input.component.css'],
    template: `
        <div class="container">
            <div *ngIf="!isEditingValue" class="edit-label">
                <dk-inline-edit-label
                    label="{{label}}: {{value}}"
                    [tooltip]="editTooltip"
                    (startEdit)="onBeginEdit()">
                </dk-inline-edit-label>
            </div>
            
            <div *ngIf="isEditingValue" class="edit-label">
                <span class="edit-label-text">{{label}}:</span>
                <dk-validated-input
                    [value]="editValue"
                    [validator]="validator"
                    (keyup.enter)="onSave()"
                    (validInput)="onInput($event)">
                </dk-validated-input>
                <dk-icon-button
                    icon="save"
                    [tooltip]="getSaveTooltip()"
                    [disabled]="!isValid"
                    (iconClick)="onSave()">
                </dk-icon-button>
            </div>
        </div>
    `
})
export class DelayedSaveInputComponent implements OnChanges, OnInit {
    @Input() label : string;
    @Input() value : string;
    @Input() validator : Validator;
    @Input() editTooltip : string;
    @Input() validTooltip : string;
    @Input() invalidTooltip : string;
    @Output() onValueSaved = new EventEmitter<string>();

    editValue : string;
    isEditingValue : boolean = false;

    ngOnInit() {
        this.editValue = this.value;
    }

    ngOnChanges(changes : {value? : SimpleChange}) {
        if (changes.value) {
            this.editValue = this.value;
            this.isEditingValue = false;
        }
    }

    onBeginEdit() {
        this.isEditingValue = true;
    }

    onSave() {
        if (!this.validator(this.editValue)) {
            return;
        }

        // if the value is the same don't do the replace or else undo/redo will have
        // a state that appears to do nothing
        if (this.editValue !== this.value) {
            this.onValueSaved.emit(this.editValue);
        }
        this.isEditingValue = false;
    }

    onInput(newEditValue : string) {
        this.editValue = newEditValue;
    }

    getSaveTooltip() {
        return this.isValid ? this.validTooltip : this.invalidTooltip;
    }

    get isValid() : boolean {
        if (!this.validator) {
            return true;
        }

        return this.validator(this.editValue);
    }
}
