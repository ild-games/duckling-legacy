import {
    Component
} from '@angular/core';

import {Entity, EntityKey, EntitySystemService, AttributeDefaultService, AttributeKey} from '../entitysystem';
import {SelectionService, Selection} from '../selection';
import {newMergeKey, MergeKey} from '../state';
import {immutableAssign} from '../util';
import {DeleteButtonComponent, ToolbarButtonComponent, InputComponent} from '../controls';
import {ProjectService} from '../project/project.service';
import {getDefaultCustomAttributeValue} from '../project/custom-attribute';

import {EntityComponent} from './entity.component';
import {EntityNameComponent} from './_entity-name.component';
import {AttributeSelectorComponent} from './attribute-selector.component';
import { AttributeDefaultAugmentationService } from '../entitysystem/services/attribute-default-augmentation.service';

/**
 * Component that allows the user to modify an entity.
 */
@Component({
    selector: "dk-entity-editor",
    template: `
        <div *ngIf="selections?.length === 0">
            <mat-card>
                <mat-card-title>
                    No Single Entity Selected
                </mat-card-title>
            </mat-card>
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
            <mat-card>
                <mat-card-title>
                    Selected Entities
                </mat-card-title>
                <mat-card-content>
                    <mat-list>
                        <mat-list-item *ngFor="let selection of selections">
                            {{selection.key}}
                        </mat-list-item>
                    </mat-list>
                </mat-card-content>
            </mat-card>
        </div>
    `
})
export class EntityEditorComponent {
    selections : Selection[];

    constructor(private _selection : SelectionService,
                private _entitySystem : EntitySystemService,
                private _attributeDefault : AttributeDefaultService,
                private _attributeDefaultAugmentation : AttributeDefaultAugmentationService,
                private _projectService : ProjectService) {
        _selection.selections.subscribe((selections) => {
            if (!selections) {
                this.selections = [];
            }
            
            this.selections = selections;
        });
    }

    onEntityChanged(entity : Entity, mergeKey : MergeKey) {
        if (this.selections.length !== 1) {
            return;
        }
        
        this._entitySystem.updateEntity(this.selections[0].key, entity, mergeKey);
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
        let mergeKey = newMergeKey();
        this.onEntityChanged(newEntity, mergeKey);

        patch = {};
        patch[key] = this._attributeDefaultAugmentation.augmentAttribute(key, {entity: this.selections[0].entity, key: this.selections[0].key});
        newEntity = immutableAssign(this.selections[0].entity, patch);
        this.onEntityChanged(newEntity, mergeKey);
    }
}
