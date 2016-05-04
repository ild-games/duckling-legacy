export type Attribute = Object;
export type AttributeKey = string;
export type Entity = {[key:string]:Attribute};
export type EntityKey = string;

export interface TaggedAttribute {
    key : AttributeKey,
    attribute : Attribute
}

export interface TaggedEntity {
    key : EntityKey,
    entity : Entity
}
