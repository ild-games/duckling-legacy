import { Entity } from "../../entitysystem/entity";
import { Box2 } from "../../math";
import { positionToAnchor } from "../../math/anchor";

import { AttributeBoundingBox } from "../../entitysystem/services/entity-box.service";
import { CollisionAttribute } from "./collision-attribute";

/**
 * Get the bounding box for an entity with a collision attribute.
 * @param entity The entity the bounding box will be built for.
 * @return A Box2 bounding box for the entity's collision attribute.
 */
export const collisionBoundingBox: AttributeBoundingBox<CollisionAttribute> = {
    getBox(collisionAttribute: CollisionAttribute): Box2 {
        if (!collisionAttribute) {
            return null;
        }
        return {
            position: {
                x: -(
                    collisionAttribute.dimension.dimension.x *
                    collisionAttribute.anchor.x
                ),
                y: -(
                    collisionAttribute.dimension.dimension.y *
                    collisionAttribute.anchor.y
                ),
            },
            dimension: collisionAttribute.dimension.dimension,
            rotation: collisionAttribute.dimension.rotation,
        };
    },
    setBox(attribute: CollisionAttribute, box2: Box2): CollisionAttribute {
        return {
            ...attribute,
            anchor: positionToAnchor(box2.position, box2.dimension),
            dimension: {
                dimension: box2.dimension,
                position: { x: 0, y: 0 },
                rotation: box2.rotation,
            },
        };
    },
};
