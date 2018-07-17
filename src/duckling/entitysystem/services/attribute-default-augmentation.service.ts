import { Component, Injectable } from "@angular/core";
import { BaseAttributeService } from "../base-attribute.service";
import { Attribute, AttributeKey, Entity } from "../entity";
import { Box2, boxUnion } from "../../math";
import {
  EntityBoxService,
  EntityKey,
  TaggedEntity,
  EntitySystemService
} from "../index";
import { immutableAssign } from "../../util/index";
import { MergeKey } from "../../state/index";

export type AugmentedServices = {
  boxService?: EntityBoxService;
};

/**
 * If further augmentation to the default entity is required on initialization then
 * implement this function. If a necessary service isn't passed in via 'services' it
 * will need to be added here and when the AttributeDefaultService calls this
 * function.
 *
 * Example: When the collision attribute is created, it should default to whatever the
 *          current bounding box of the entity is.
 */
export type AttributeDefaultAugmentation = (
  taggedEntity: TaggedEntity,
  defaultAttribute: Attribute,
  services?: AugmentedServices
) => Attribute;

/**
 * The AttributeDefault service is used to create new entities and attributes.
 */
@Injectable()
export class AttributeDefaultAugmentationService extends BaseAttributeService<
  AttributeDefaultAugmentation
> {
  constructor(private _entityBoxService: EntityBoxService) {
    super();
  }

  augmentEntity(taggedEntity: TaggedEntity): Entity {
    let patch: Entity = {};

    for (let key in taggedEntity.entity) {
      patch[key] = this.augmentAttribute(key, taggedEntity);
    }

    return immutableAssign(taggedEntity.entity, patch);
  }

  augmentAttribute(key: AttributeKey, taggedEntity: TaggedEntity): Attribute {
    let impl = this.getImplementation(key);
    return this._getDefaultFromImplementation(impl, key, taggedEntity);
  }

  private _getDefaultFromImplementation(
    implementation: AttributeDefaultAugmentation,
    attributeKey: AttributeKey,
    taggedEntity: TaggedEntity
  ): Attribute {
    let patch = immutableAssign(taggedEntity.entity[attributeKey], {});
    if (implementation) {
      patch = implementation(taggedEntity, taggedEntity.entity[attributeKey], {
        boxService: this._entityBoxService
      });
    }
    return patch;
  }
}
