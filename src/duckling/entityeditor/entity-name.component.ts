import {
    Component,
    Input,
    Output,
    EventEmitter,
    SimpleChange,
    OnChanges
} from '@angular/core';

import {EntitySystemService, EntityKey} from '../entitysystem';
import {DeleteButton, InputComponent} from '../controls';

/**
 * Component that allows the user to modify an entity.
 */
@Component({
    selector: "dk-entity-name",
    directives: [
        DeleteButton,
        InputComponent,
    ],
    styleUrls: ['./duckling/entityeditor/entity-name.component.css'],
    template: `
        <span class="entity-name-row">
            <div *ngIf="!isEditingName" class="entity-name">
                <span class="entity-name-text">Entity: {{currentSelectedEntity}}</span>
                <dk-icon-button
                    icon="pencil"
                    tooltip="Edit entity name"
                    (click)="onEditEntityName()">
                </dk-icon-button>
            </div>
            <div *ngIf="isEditingName" class="entity-name">
                <span class="entity-name-text">Entity:</span>
                <dk-input
                    [value]="editEntityName"
                    [dividerColor]="isValidEntityName(editEntityName) ? 'primary' : 'warn'"
                    (keyup.enter)="onSaveEntityName()"
                    (inputChanged)="onEntityNameInput($event)">
                </dk-input>
                <dk-icon-button
                    icon="save"
                    [tooltip]="getSaveNameTooltip()"
                    [disabled]="!isValidEntityName(editEntityName)"
                    (click)="onSaveEntityName()">
                </dk-icon-button>
            </div>
            <dk-delete-button (click)="onDeleteClicked()"></dk-delete-button>
        </span>
    `
})
export class EntityNameComponent implements OnChanges {
    @Input() currentSelectedEntity : EntityKey;
    @Output() deleteEntity = new EventEmitter<any>();
    @Output() renameEntity = new EventEmitter<any>();

    editEntityName : string;
    isEditingName : boolean = false;

    constructor(private _entitySystem : EntitySystemService) {
    }

    ngOnChanges(changes : {currentSelectedEntity? : SimpleChange}) {
        if (changes.currentSelectedEntity) {
            this.editEntityName = this.currentSelectedEntity;
            this.isEditingName = false;
        }
    }

    onEditEntityName() {
        this.isEditingName = true;
    }

    onSaveEntityName() {
        if (!this.isValidEntityName(this.editEntityName)) {
            return;
        }

        // if the name is the same don't do the replace or else undo/redo will have
        // a state that appears to do nothing
        if (this.editEntityName !== this.currentSelectedEntity) {
            this.renameEntity.emit(this.editEntityName);
        }
        this.isEditingName = false;
    }

    onEntityNameInput(newEntityName : string) {
        this.editEntityName = newEntityName;
    }

    onDeleteClicked() {
        this.deleteEntity.emit(true);
    }

    isValidEntityName(newEntityName : string) : boolean {
        if (!newEntityName || newEntityName === "") {
            return false;
        }
        if (newEntityName === this.currentSelectedEntity) {
            return true;
        }

        let currentEntity = this._entitySystem.getEntity(newEntityName);
        if (currentEntity) {
            return false;
        }

        return true;
    }

    getSaveNameTooltip() {
        if (this.isValidEntityName(this.editEntityName)) {
            return "Save entity name";
        } else {
            return "Entity name cannot be a duplicate or blank";
        }
    }
}
