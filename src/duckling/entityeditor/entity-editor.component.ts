import {
    Component
} from '@angular/core';

import {Entity, EntityKey, EntitySystemService, AttributeDefaultService, AttributeKey} from '../entitysystem';
import {SelectionService, Selection} from '../selection';
import {newMergeKey} from '../state';
import {immutableAssign} from '../util';
import {DeleteButton, ToolbarButton, InputComponent} from '../controls';

import {EntityComponent} from './entity.component';
import {AttributeSelectorComponent} from './attribute-selector.component';

/**
 * Component that allows the user to modify an entity.
 */
@Component({
    selector: "dk-entity-editor",
    directives: [
        EntityComponent,
        AttributeSelectorComponent,
        DeleteButton,
        ToolbarButton,
        InputComponent
    ],
    styleUrls: ['./duckling/entityeditor/entity-editor.component.css'],
    template: `
        <div *ngIf="selection?.selectedEntity">
            <span class="entity-name-row">
                <div *ngIf="!isEditingName">
                    <span class="entity-name">Entity: {{selection.selectedEntity}}</span>
                    <dk-icon-button
                        icon="pencil"
                        tooltip="Edit entity name"
                        (click)="onEditEntityName()">
                    </dk-icon-button>
                </div>
                <div *ngIf="isEditingName">
                    <span class="entity-name">Entity:</span>
                    <dk-input
                        label="Entity name"
                        [value]="entityName">
                    </dk-input>
                    <dk-icon-button
                        icon="save"
                        tooltip="Save entity name"
                        (click)="onSaveEntityName()">
                    </dk-icon-button>
                </div>
                <dk-delete-button (click)="deleteEntity()"></dk-delete-button>
            </span>
            <dk-entity-component
                [entity]="selection.entity"
                (entityChanged)="onEntityChanged($event)">
            </dk-entity-component>
            <dk-attribute-selector
                (addAttribute)="addAttribute($event)"
                [entity]="selection.entity">
            </dk-attribute-selector>
        </div>
        <div *ngIf="!(selection?.selectedEntity)">
            <md-card>
                <md-card-content>
                    No Entity Selected
                </md-card-content>
            </md-card>
        </div>
    `
})
export class EntityEditorComponent {
    selection : Selection;
    isEditingName : boolean = false;
    entityName : string;

    constructor(private _selection : SelectionService,
                private _entitySystem : EntitySystemService,
                private _attributeDefault : AttributeDefaultService) {
        _selection.selection.subscribe((selection) => {
            this.selection = selection
            this.entityName = selection.selectedEntity;
        });
    }

    onEntityChanged(entity : Entity) {
        this._entitySystem.updateEntity(this.selection.selectedEntity, entity);
    }

    deleteEntity() {
        var mergeKey = newMergeKey();
        var entityKey = this.selection.selectedEntity;
        this._selection.deselect(mergeKey);
        this._entitySystem.deleteEntity(entityKey, mergeKey);
    }

    addAttribute(key : AttributeKey) {
        var defaultAttribute = this._attributeDefault.createAttribute(key);

        var patch : any = {};
        patch[key] = defaultAttribute;
        var newEntity = immutableAssign(this.selection.entity, patch);
        this.onEntityChanged(newEntity);
    }

    onEditEntityName() {
        this.isEditingName = true;
    }
}
