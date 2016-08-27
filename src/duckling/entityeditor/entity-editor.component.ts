import {
    Component
} from '@angular/core';

import {Entity, EntityKey, EntitySystemService, AttributeDefaultService, AttributeKey} from '../entitysystem';
import {SelectionService, Selection} from '../selection';
import {newMergeKey} from '../state';
import {immutableAssign} from '../util';
import {Icon} from '../controls/icon.component';

import {EntityComponent} from './entity.component';
import {AttributeSelectorComponent} from './attribute-selector.component';

/**
 * Component that allows the user to modify an entity.
 */
@Component({
    selector: "dk-entity-editor",
    directives: [EntityComponent, AttributeSelectorComponent, Icon],
    template: `
        <div *ngIf="selection?.selectedEntity">
            <span>
                Entity {{selection.selectedEntity}}
                <button
                    [disableRipple]=true
                    md-mini-fab
                    title="Delete Entity"
                    color="warn"
                    (click)="deleteEntity()">
                    <dk-icon iconClass="trash"></dk-icon>
                </button>
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

    constructor(private _selection : SelectionService,
                private _entitySystem : EntitySystemService,
                private _attributeDefault : AttributeDefaultService) {
        _selection.selection
            .subscribe((selection) => this.selection = selection);
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
}
