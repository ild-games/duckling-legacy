import { EntityKey, Attribute } from "../../entitysystem/entity";
import { Vector } from "../../math";

export const CAMERA_KEY = "camera";

/**
 * Applied on entities that are cameras.
 */
export interface CameraAttribute extends Attribute {
    renderPriority: number;
    scale: number;
    size: Vector;
    offset: Vector;
    default: boolean;
    follows: EntityKey;
    upperBounds: Vector;
    lowerBounds: Vector;
}

export let defaultCamera: CameraAttribute = {
    renderPriority: 0,
    scale: 1,
    size: {
        x: 1,
        y: 1,
    },
    offset: {
        x: 0,
        y: 0,
    },
    default: false,
    follows: "",
    upperBounds: {
        x: 1000000,
        y: 1000000,
    },
    lowerBounds: {
        x: -1000000,
        y: -1000000,
    },
};
