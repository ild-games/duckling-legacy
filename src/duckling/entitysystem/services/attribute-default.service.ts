import {Component, Injectable} from '@angular/core';
import {BaseAttributeService} from '../base-attribute-service';
import {Attribute, AttributeKey, Entity} from '../entity';
import {Box2, boxUnion} from '../../math';

/**
 * Describes the default behavior and state of an attribute.
 */
export interface AttributeDefault {
    /**
     * Set to true if new entities should have the component by default.
     */
    createByDefault? : boolean,

    /**
     * The default value for an attribute. If createByDefault is set to true the default
     * is used whenever an entity is created.  Otherwise it is used when a user adds an
     * attribute to an entity.
     */
    default : Attribute;
}

/**
 * The AttributeDefault service is used to create new entities and attributes.
 */
@Injectable()
export class AttributeDefaultService extends BaseAttributeService<AttributeDefault> {

    createAttribute(key : AttributeKey) : Attribute {
        return this.getImplementation(key).default;
    }

    createEntity() : Entity {
        var entity : Entity = {};

        this.forEach((key, defaults) => {
            if (defaults.createByDefault) {
                entity[key] = defaults.default;
            }
        });

        return entity;
    }
}
