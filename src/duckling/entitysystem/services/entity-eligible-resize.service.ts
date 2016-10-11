import {Injectable} from '@angular/core';

import {BaseAttributeService} from '../base-attribute.service';
import {AttributeKey, Entity} from '../entity';

export type AttributeEligibleForResize = () => boolean;

@Injectable()
export class EntityEligibleResizeService extends BaseAttributeService<AttributeEligibleForResize> {
    isAttributeResizable(key : AttributeKey) {
        let getEligible = this.getImplementation(key);
        if (getEligible) {
            return getEligible();
        }
        return false;
    }

    isEntityResizable(entity : Entity) {
        let resizable = false;
        for (let key in entity) {
            resizable = resizable || this.isAttributeResizable(key);
        }
        return resizable;
    }
}
