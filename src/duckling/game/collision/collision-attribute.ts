import { Attribute, Entity } from "../../entitysystem/entity";
import { Vector } from "../../math/vector";
import { Box2 } from "../../math/box2";
import { SelectOption, toSelectOptions } from "../../controls";
import { immutableAssign } from "../../util/index";
import { AugmentedServices } from "../../entitysystem/services/attribute-default-augmentation.service";
import { TaggedEntity } from "../../entitysystem/index";

export const COLLISION_KEY = "collision";

export type BodyType = "none" | "solid" | "environment";
export let BodyTypeSelect: SelectOption[] = toSelectOptions<BodyType>(
  "none",
  "solid",
  "environment"
);

/**
 * CollisionAttribute should be attached to entities that need solid body physics.
 * or collision actions.
 */
export interface CollisionAttribute extends Attribute {
  /**
   * The collision box used for calculating collision.
   */
  dimension: Box2;
  /**
   * Describes how the entity behaves in the solid body system.
   */
  bodyType: BodyType;
  /**
   * Describes what actions are taken for the entity on collision.
   */
  collisionType: string;
  /**
   * Used to implement one way platforms and walls.  The normal vector should point
   * towards the direction other entities are unable to pass through.
   */
  oneWayNormal: Vector;
  /**
   * point on the collision box the anchor/origin point is (%)
   */
  anchor: Vector;
}

export let defaultCollision: CollisionAttribute = {
  dimension: {
    dimension: {
      x: 32,
      y: 32
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
};

export function defaultCollisionAugmentation(
  taggedEntity: TaggedEntity,
  defaultAttribute: CollisionAttribute,
  services: AugmentedServices
): CollisionAttribute {
  let boundingBox = services.boxService.getEntityBox(taggedEntity.key);
  if (boundingBox) {
    defaultAttribute = {
      ...defaultAttribute,
      dimension: {
        ...defaultAttribute.dimension,
        dimension: boundingBox.dimension
      }
    };
  }
  return defaultAttribute;
}

/**
 * Retrieve the collision attribute from the entity.
 * @param  entity Entity the component will be retrieved from.
 * @return Collision attribute belonging to the entity.
 */
export function getCollision(entity: Entity): CollisionAttribute {
  return <CollisionAttribute>entity[COLLISION_KEY];
}
