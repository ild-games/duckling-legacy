export type Attribute = Object;
export type AttributeKey = string;
export type Entity = {[key:string]:Attribute};

export interface KeyedAttribute {
    key : AttributeKey,
    attribute : Attribute
}
