import {Injectable} from '@angular/core';

import {Entity, EntitySystem} from '../../entitysystem/entity';


/**
 * Service to sort entities by a render priority
 */
@Injectable()
export class RenderPriorityService {

    /**
     * Sorts the entity system so the render priorities of the entities drawable attributes are
     * respected.
     * @param  entitySystem EntitySystem to sort for drawing
     * @return Array of entities sorted for drawing
     */
    sortEntities(entitySystem : EntitySystem) : Array<Entity> {
        throw new Error("Not yet implemented");
    }
}
