import {Attribute, Entity} from '../../entitysystem/entity';
import {Vector} from '../../math/vector';
import {Box2} from '../../math/box2';
import {SelectOption, toSelectOptions} from '../../controls';

export const COLLISION_KEY = "collision";


export type BodyType = "none" | "solid" | "environment";
export let BodyTypeSelect : SelectOption[] = toSelectOptions<BodyType>("none", "solid", "environment");


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
     * Describes how the entity behaves in the solid body system.
     */
    bodyType : BodyType;
    /**
     * Describes what actions are taken for the entity on collision.
     */
    collisionType : string;
    /**
     * Used to implement one way platforms and walls.  The normal vector should point
     * towards the direction other entities are unable to pass through.
     */
    oneWayNormal : Vector;
    /**
     * point on the collision box the anchor/origin point is (%)
     */
    anchor : Vector;
}

export let defaultCollision : CollisionAttribute = {
    dimension: {
        dimension: {
            x: 10,
            y: 10
        },
        position: {
            x: 0,
            y: 0
        },
        rotation: 0
    },
    bodyType: "environment",
    collisionType: "none",
    oneWayNormal: {
        x: 0,
        y: 0
    },
    anchor: {
        x: 0,
        y: 0    
    }
}

/**
 * Retrieve the collision attribute from the entity.
 * @param  entity Entity the component will be retrieved from.
 * @return Collision attribute belonging to the entity.
 */
export function getCollision(entity : Entity) : CollisionAttribute {
    return <CollisionAttribute>entity[COLLISION_KEY];
}
