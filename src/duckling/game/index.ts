import {AttributeComponentService} from '../entitysystem/attribute-component.service';
import {EntityDrawerService} from '../canvas/drawing/entity-drawer.service';
import {POSITION_KEY} from './position/position-attribute';
import {COLLISION_KEY} from './collision/collision-attribute';
import {PositionComponent} from './position/position.component';
import {CollisionComponent} from './collision/collision.component';
import {drawCollision} from './collision/collision-drawer';

export function bootstrapGameComponents(
        attributeComponents : AttributeComponentService,
        entityDrawers : EntityDrawerService) {

    //Bootstrap Position
    attributeComponents.register(POSITION_KEY, PositionComponent);

    //Bootstrap Collsion
    attributeComponents.register(COLLISION_KEY, CollisionComponent);
    entityDrawers.register(COLLISION_KEY, drawCollision);
}
