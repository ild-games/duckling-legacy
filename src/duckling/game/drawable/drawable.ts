import {Vector} from '../../math';

export enum DrawableType {
    Shape,
    Container,
    Image,
    Animated
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

export var defaultDrawable : Drawable = {
    __cpp_type: null,
    type: null,
    key: "TopDrawable",
    inactive: false,
    renderPriority: 0,
    scale: {
        x: 1,
        y: 1
    },
    rotation: 0,
    positionOffset: {
        x: 0,
        y: 0
    },
    priorityOffset: 0
};
