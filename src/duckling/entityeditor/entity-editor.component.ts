import {
    Component
} from '@angular/core';

import {Entity, EntityKey, EntitySystemService, AttributeDefaultService, AttributeKey} from '../entitysystem';
import {SelectionService, Selection} from '../selection';
import {newMergeKey} from '../state';
import {immutableAssign} from '../util';
import {DeleteButtonComponent, ToolbarButtonComponent, InputComponent} from '../controls';
import {ProjectService} from '../project/project.service';
import {getDefaultCustomAttributeValue} from '../project/custom-attribute';

import {EntityComponent} from './entity.component';
import {EntityNameComponent} from './_entity-name.component';
import {AttributeSelectorComponent} from './attribute-selector.component';

/**
 * Component that allows the user to modify an entity.
 */
@Component({
    selector: "dk-entity-editor",
    template: `
        <div *ngIf="selections?.length === 0">
            <md-card>
                <md-card-title>
                    No Single Entity Selected
                </md-card-title>
            </md-card>
        </div>
        
        <div *ngIf="selections?.length === 1">
            <dk-entity-name
                [currentSelectedEntity]="selections[0].key"
                (deleteEntity)="onDeleteEntity()"
                (renameEntity)="onRenameEntity($event)">
            </dk-entity-name>
            <dk-entity
                [entity]="selections[0].entity"
                (entityChanged)="onEntityChanged($event)">
            </dk-entity>
            <dk-attribute-selector
                (addAttribute)="addAttribute($event)"
                [entity]="selections[0].entity">
            </dk-attribute-selector>
        </div>
        
        <div *ngIf="selections?.length > 1">
            <md-card>
                <md-card-title>
                    Selected Entities
                </md-card-title>
                <md-card-content>
                    <md-list>
                        <md-list-item *ngFor="let selection of selections">
                            {{selection.key}}
                        </md-list-item>
                    </md-list>
                </md-card-content>
            </md-card>
        </div>
    `
})
export class EntityEditorComponent {
    selections : Selection[];

    constructor(private _selection : SelectionService,
                private _entitySystem : EntitySystemService,
                private _attributeDefault : AttributeDefaultService,
                private _projectService : ProjectService) {
        _selection.selections.subscribe((selections) => {
            if (!selections) {
                this.selections = [];
            }
            
            this.selections = selections;
        });
    }

    onEntityChanged(entity : Entity) {
        if (this.selections.length !== 1) {
            return;
        }
        
        this._entitySystem.updateEntity(this.selections[0].key, entity);
    }

    onDeleteEntity() {
        if (this.selections.length !== 1) {
            return;
        }
        
        let mergeKey = newMergeKey();
        let entityKey = this.selections[0].key;
        this._selection.deselect(mergeKey);
        this._entitySystem.deleteEntity(entityKey, mergeKey);
    }

    onRenameEntity(newName : string) {
        if (this.selections.length !== 1) {
            return;
        }
        
        let mergeKey = newMergeKey();
        this._entitySystem.renameEntity(this.selections[0].key, newName, mergeKey);
        this._selection.select([newName], mergeKey);
    }

    addAttribute(key : AttributeKey) {
        if (this.selections.length !== 1) {
            return;
        }
        
        let defaultAttribute = {};
        if (this._projectService.isCustomAttribute(key)) {
            defaultAttribute = getDefaultCustomAttributeValue(this._projectService.getCustomAttribute(key));
        } else {
            defaultAttribute = this._attributeDefault.createAttribute(key);
        }

        let patch : any = {};
        patch[key] = defaultAttribute;
        let newEntity = immutableAssign(this.selections[0].entity, patch);
        this.onEntityChanged(newEntity);
    }
}
