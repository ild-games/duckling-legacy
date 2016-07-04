import {Vector} from '../../math';

export enum DrawableType {
    Shape,
    Container
}

export interface Drawable {
    type : DrawableType;
    scale: Vector;
    rotation: number;
    color: string;
}
