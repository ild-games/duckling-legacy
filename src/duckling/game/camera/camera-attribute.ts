import {Attribute} from '../../entitysystem/entity';

export const CAMERA_KEY = "camera";

/**
 * Applied on entities that are cameras.
 */
export interface CameraAttribute extends Attribute {
}

export var defaultCamera : CameraAttribute = {
};
