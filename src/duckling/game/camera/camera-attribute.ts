import {Attribute} from '../../entitysystem/entity';
import {Vector} from '../../math';

export const CAMERA_KEY = "camera";

/**
 * Applied on entities that are cameras.
 */
export interface CameraAttribute extends Attribute {
    renderPriority : number,
    scale : number,
    size : Vector,
    default : boolean,
    follows : string
}

export var defaultCamera : CameraAttribute = {
    renderPriority: 0,
    scale: 1,
    size: {
        x: 1,
        y: 1
    },
    default: false,
    follows: ""
};
