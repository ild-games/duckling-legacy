import {Vector} from '../../math';

export enum DrawableType {
    Shape,
    Container
}

export interface Drawable {
    type : DrawableType;
    renderPriority : number;
    scale: Vector;
    rotation: number;
    bounds: Vector;
}
