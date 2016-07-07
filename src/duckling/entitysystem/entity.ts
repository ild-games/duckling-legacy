import {Map} from 'immutable';

export type Attribute = Object;
export type AttributeKey = string;
export type Entity = {[key:string]:Attribute};
export type EntityKey = string;

export type EntitySystem = Map<EntityKey,Entity>;

export function createEntitySystem() : EntitySystem {
    return Map<EntityKey,Entity>();
}

export interface TaggedAttribute {
    key : AttributeKey,
    attribute : Attribute
}

export interface TaggedEntity {
    key : EntityKey,
    entity : Entity
}
