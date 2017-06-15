import {RenderPriorityService} from '../canvas/drawing/render-priority.service';
import {Entity, EntityKey, EntitySystem, TaggedEntity} from '../entitysystem/entity';

import {DrawableAttribute, getDrawableAttribute, drawableAttributeSorter} from './drawable/drawable-attribute';

export class AnconaSFMLRenderPriorityService extends RenderPriorityService {
    sortEntities(entitySystem : EntitySystem) : Array<TaggedEntity> {
        let sortedDrawableAttributeEntities : TaggedEntity[] = [];
        let otherEntities : TaggedEntity[] = [];
        entitySystem.forEach((entity : Entity, key : EntityKey) => {
            let drawable : DrawableAttribute = getDrawableAttribute(entity);
            let taggedEntity = {
                entity,
                key
            }
            if (drawable && drawable.topDrawable) {
                sortedDrawableAttributeEntities.push(taggedEntity);
            } else {
                otherEntities.push(taggedEntity)
            }
        });
        sortedDrawableAttributeEntities.sort(drawableAttributeSorter);
        return sortedDrawableAttributeEntities.concat(otherEntities);
    }
}