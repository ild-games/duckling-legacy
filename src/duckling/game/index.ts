import {
    AttributeComponentService,
    AttributeDefaultService,
    EntityBoxService,
    EntitySystemService,
    EntityPositionSetService
} from '../entitysystem';

import {EntityDrawerService} from '../canvas/drawing/entity-drawer.service';
import {defaultPosition, POSITION_KEY} from './position/position-attribute';
import {setPosition} from './position/set-position';
import {defaultCollison, COLLISION_KEY} from './collision/collision-attribute';
import {PositionComponent} from './position/position.component';
import {CollisionComponent} from './collision/collision.component';
import {drawCollision} from './collision/collision-drawer';
import {collisionBoundingBox} from './collision/collision-box';

/**
 * Initialize the Services used by duckling to interact with the attribute implementations.
 */
export function bootstrapGameComponents(services: {
        attributeDefaultService : AttributeDefaultService;
        entityPositionSetService : EntityPositionSetService,
        entityBoxService: EntityBoxService,
        attributeComponentService: AttributeComponentService,
        entityDrawerService: EntityDrawerService}) {

    //Bootstrap Position
    services.attributeComponentService.register(POSITION_KEY, PositionComponent);
    services.attributeDefaultService.register(POSITION_KEY, {createByDefault: true, default: defaultPosition});
    services.entityPositionSetService.register(POSITION_KEY, setPosition);

    //Bootstrap Collsion
    services.attributeComponentService.register(COLLISION_KEY, CollisionComponent);
    services.entityDrawerService.register(COLLISION_KEY, drawCollision);
    services.entityBoxService.register(COLLISION_KEY, collisionBoundingBox);
    services.attributeDefaultService.register(COLLISION_KEY, {createByDefault: true, default: defaultCollison});
}
