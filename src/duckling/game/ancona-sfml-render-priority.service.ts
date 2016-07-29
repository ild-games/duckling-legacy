import {RenderPriorityService} from '../canvas/drawing/render-priority.service';
import {Entity, EntitySystem} from '../entitysystem/entity';

import {DrawableAttribute, getDrawableAttribute, drawableAttributeSorter} from './drawable/drawable-attribute';

export class AnconaSFMLRenderPriorityService extends RenderPriorityService {
    sortEntities(entitySystem : EntitySystem) : Array<Entity> {
        let sortedDrawableAttributeEntities : Entity[] = [];
        let otherEntities : Entity[] = [];
        entitySystem.forEach((entity : Entity) => {
            let drawable : DrawableAttribute = getDrawableAttribute(entity);
            if (drawable && drawable.topDrawable) {
                sortedDrawableAttributeEntities.push(entity);
            } else {
                otherEntities.push(entity)
            }
        });
        sortedDrawableAttributeEntities.sort(drawableAttributeSorter);
        return sortedDrawableAttributeEntities.concat(otherEntities);
    }
}
