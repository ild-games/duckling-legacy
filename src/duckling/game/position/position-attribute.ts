import {Attribute, Entity} from '../../entitysystem/entity';
import {Vector} from '../../math/vector';

export const POSITION_KEY = "position";

/**
 * Describes an entities position in the map.
 */
export interface PositionAttribute extends Attribute {
    /**
     * Vector containing the entities position.
     */
    position : Vector,

    /**
     * Vector containing the entities initial velocity.
     */
    velocity : Vector
}

/**
 * Retrieve the position attribute from the entity.
 * @param  entity Entity the component will be retrieved from.
 * @return Position attribute belonging to the entity.
 */
export function getPosition(entity : Entity) : PositionAttribute {
    return <PositionAttribute>entity[POSITION_KEY];
}
