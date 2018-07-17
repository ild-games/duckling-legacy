import { Entity, Attribute } from "../../entitysystem/entity";

export const ROTATE_KEY = "rotate";

export interface RotateAttribute extends Attribute {
  speed: number;
}

export let defaultRotate: RotateAttribute = {
  speed: 0
};

export function getRotate(entity: Entity): RotateAttribute {
  return <RotateAttribute>entity[ROTATE_KEY];
}
