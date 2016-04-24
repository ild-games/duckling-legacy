import {Attribute, Entity} from '../../entitysystem/entity';
import {Vector} from '../../math/vector';
import {Box2} from '../../math/box2';

export const COLLISION_KEY = "collision";

/**
 * Describes how the entity behaves in the solid body system.
 */
export enum BodyType {
    None,
    Solid,
    Environment
}

/**
 * Describes what actions are taken for the entity on collision.
 */
export enum CollisionType {
    None,
    Player,
    Ground
}

/**
 * CollisionAttribute should be attached to entities that need solid body physics.
 * or collision actions.
 */
export interface CollisionAttribute extends Attribute {
    /**
     * The collision box used for calculating collision.
     */
    dimension : Box2;
    /**
     * @See BodyType
     */
    bodyType : BodyType
    /**
     * @See CollisionType
     */
    collisionType : CollisionType;
    /**
     * Used to implement one way platforms and walls.  The normal vector should point
     * towards the direction other entities are unable to pass through.
     */
    oneWayNormal : Vector;
}

/**
 * Retrieve the collision attribute from the entity.
 * @param  entity Entity the component will be retrieved from.
 * @return Collision attribute belonging to the entity.
 */
export function getCollision(entity : Entity) : CollisionAttribute {
    return <CollisionAttribute>entity[COLLISION_KEY];
}
