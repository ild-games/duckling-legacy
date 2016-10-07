import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    Injectable,
    ViewContainerRef
} from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';

import {Attribute, Entity, EntityKey} from '../entity';
import {BaseAttributeService} from '../base-attribute-service';
import {EntitySystemService} from '../entity-system.service';
import {LayerDialogComponent} from '../../controls';

/**
 * Function type that is used to set a position.
 * @returns Returns the new value of the attribute.
 */
export type LayerGetter = (attribute : Attribute) => Number;

/**
 * The EntityLayerService is used to retrieve the layer of an entity.
 */
@Injectable()
export class EntityLayerService extends BaseAttributeService<LayerGetter> {

    private _layerDialogRef : MdDialogRef<LayerDialogComponent>;

    constructor(private _entitySystemService : EntitySystemService,
                private _materialDialog : MdDialog,
                private _viewContainerRef : ViewContainerRef) {
        super();
    }

    /**
     * Get the layer of the entity
     * @param entityKey The key of the entity to get the layer from
     */
    getLayer(entityKey: EntityKey) {
        let entity = this._entitySystemService.getEntity(entityKey);

        for (let key in entity) {
            let getLayer = this.getImplementation(key);
            if (getLayer) {
                return getLayer(entity[key]);
            }
        }
    }

    onShowHideLayersClicked() {
        let dialogConfig = new MdDialogConfig();
        dialogConfig.viewContainerRef = this._viewContainerRef;
        this._layerDialogRef = this._materialDialog.open(LayerDialogComponent, dialogConfig);
    }

}
