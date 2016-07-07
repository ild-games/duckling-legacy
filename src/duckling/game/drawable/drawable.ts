import {Vector} from '../../math';

export enum DrawableType {
    Shape,
    Container
}

export interface Drawable {
    key : string
    type : DrawableType;
    __cpp_type: string;
    renderPriority : number;
    scale : Vector;
    rotation : number;
    bounds : Vector;
    inactive : boolean;
    positionOffset : Vector;
    priorityOffset : number;
}
