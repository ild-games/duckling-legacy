import {Injectable} from '@angular/core';

import {Entity, AttributeKey} from '../entity';
import {AttributeDefaultService} from './attribute-default.service';
import {ProjectService} from '../../project/project.service';

/**
 * Service used to determine what attributes are available in general or for a specific entity.
 */
@Injectable()
export class AvailableAttributeService {
    constructor(private _attributeDefault : AttributeDefaultService,
                private _projectService : ProjectService) {

    }

    /**
     * Get the attributes that could be added to the entity.
     * @param  entity The entity the components will be added to. (Optional argument, if not provided all available entities will be returned)
     * @return An array of available AttributeKeys.
     */
    availableAttributes(entity : Entity = {}) {
        return this._availableDefaultAttributes(entity).concat(this._availableCustomAttributes(entity));
    }

    private _availableDefaultAttributes(entity : Entity) : AttributeKey[] {
        let available : AttributeKey [] = [];
        this._attributeDefault.forEach((key) => {
            if (!(key in entity)) {
                available.push(key);
            }
        });
        
        return available;
    }

    private _availableCustomAttributes(entity : Entity) : AttributeKey[] {
        let available : AttributeKey [] = [];
        for (let customAttribute of this._projectService.project.getValue().customAttributes) {
            if (!(customAttribute.key in entity)) {
                available.push(customAttribute.key);
            }
        }
        return available;
    }
}
