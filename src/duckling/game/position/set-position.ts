import { PositionAttribute } from "./position-attribute";
import { Vector } from "../../math";
import { immutableAssign } from "../../util";

/**
 * Will be registered with the EntityPositionService.
 */
export function setPosition(
    attribute: PositionAttribute,
    newPosition: Vector
): PositionAttribute {
    return immutableAssign(attribute, { position: newPosition });
}
