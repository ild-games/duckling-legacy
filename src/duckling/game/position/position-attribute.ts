import {Attribute} from '../../entitysystem/entity';
import {Vector} from '../../math/vector';

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
