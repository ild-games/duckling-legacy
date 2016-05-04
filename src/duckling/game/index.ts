import {AttributeComponentService} from '../entitysystem/attribute-component.service';
import {PositionComponent} from './position/position.component';
import {CollisionComponent} from './collision/collision.component';

export function bootstrapGameComponents(attributeComponents : AttributeComponentService) {
    attributeComponents.register("position", PositionComponent);
    attributeComponents.register("collision", CollisionComponent);
}
