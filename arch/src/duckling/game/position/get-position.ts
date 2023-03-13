import { PositionAttribute } from "./position-attribute";
import { Vector } from "../../math";

/**
 * Will be registered with the EntityPositionService.
 */
export function getPosition(attribute: PositionAttribute): Vector {
    return {
        x: attribute.position.x,
        y: attribute.position.y,
    };
}
