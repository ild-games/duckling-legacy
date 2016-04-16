import {Attribute} from '../../entitysystem/entity';
import {Vector} from '../../math/vector';

export interface PositionAttribute extends Attribute {
    position : Vector,
    velocity : Vector
}
