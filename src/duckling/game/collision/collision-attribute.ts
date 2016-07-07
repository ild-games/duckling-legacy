import {Attribute, Entity} from '../../entitysystem/entity';
import {Vector} from '../../math/vector';
import {Box2} from '../../math/box2';
import {SelectOption} from '../../controls';

export const COLLISION_KEY = "collision";

/**
 * Describes how the entity behaves in the solid body system.
 */
export type BodyType = "none" | "solid" | "environment";
export var BodyTypeSelect : SelectOption[] = [
    {
        value: "none",
        title: "None"
    },
    {
        value: "solid",
        title: "Solid"
    },
    {
        value: "environment",
        title: "Environment"
    }
];




/**
 * Describes what actions are taken for the entity on collision.
 */
export type CollisionType = "none" | "player" | "ground";
export var CollisionTypeSelect : SelectOption[] = [
    {
        value: "none",
        title: "None"
    },
    {
        value: "player",
        title: "Player"
    },
    {
        value: "ground",
        title: "Ground"
    }
];


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
    bodyType : BodyType;
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

export var defaultCollison : CollisionAttribute = {
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
