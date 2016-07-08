import {Vector} from '../../math';

export enum DrawableType {
    Shape,
    Container
}

export interface Drawable {
    __cpp_type: string;
    type : DrawableType;
    key : string
    renderPriority : number;
    scale : Vector;
    rotation : number;
    inactive : boolean;
    positionOffset : Vector;
    priorityOffset : number;
}
