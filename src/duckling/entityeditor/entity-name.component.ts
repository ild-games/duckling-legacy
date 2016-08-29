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
                    [value]="entityName"
                    [dividerColor]="validNewName ? 'primary' : 'warn'"
                    (keyup.enter)="onSaveEntityName()"
                    (inputChanged)="onEntityNameInput($event)">
                </dk-input>
                <dk-icon-button
                    icon="save"
                    [tooltip]="getSaveNameTooltip()"
                    [disabled]="!validNewName"
                    (click)="onSaveEntityName()">
                </dk-icon-button>
            </div>
            <dk-delete-button (click)="onDeleteClicked()"></dk-delete-button>
    `
})
export class EntityNameComponent implements OnChanges {
    @Input() currentSelectedEntity : EntityKey;
    @Output() deleteEntity = new EventEmitter<any>();
    @Output() renameEntity = new EventEmitter<any>();

    entityName : string;
    isEditingName : boolean = false;
    validNewName : boolean = true;
    beginEditName : string = "";

    constructor(private _entitySystem : EntitySystemService) {
    }

    ngOnChanges(changes : {currentSelectedEntity? : SimpleChange}) {
        if (changes.currentSelectedEntity) {
            this.entityName = this.currentSelectedEntity;
            this.isEditingName = false;
        }
    }

    onEditEntityName() {
        this.isEditingName = true;
        this.beginEditName = this.entityName;
    }

    onSaveEntityName() {
        if (!this.validNewName) {
            return;
        }

        // if the name is the same don't do the replace or else undo/redo will have
        // an state that appears to do nothing
        if (this.entityName !== this.currentSelectedEntity) {
            this.renameEntity.emit(this.entityName);
        }
        this.isEditingName = false;
    }

    onEntityNameInput(newEntityName : string) {
        if (this._validEntityName(newEntityName)) {
            this.validNewName = true;
            this.entityName = newEntityName;
        } else {
            this.validNewName = false;
        }
    }

    onDeleteClicked() {
        this.deleteEntity.emit(true);
    }

    private _validEntityName(newEntityName : string) : boolean {
        if (!newEntityName || newEntityName === "") {
            return false;
        }
        if (newEntityName === this.beginEditName) {
            return true;
        }

        let currentEntity = this._entitySystem.getEntity(newEntityName);
        if (currentEntity) {
            return false;
        }

        return true;
    }

    getSaveNameTooltip() {
        if (this.validNewName) {
            return "Save entity name";
        } else {
            return "Entity name cannot be a duplicate or blank";
        }
    }
}
