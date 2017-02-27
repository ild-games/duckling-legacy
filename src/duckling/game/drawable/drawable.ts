import {Vector} from '../../math';

export enum DrawableType {
    Shape,
    Container,
    Image,
    Animated,
    Text,
    TileBlock
}

export function cppTypeToDrawableType(cppType : string) : DrawableType {
    switch (cppType) {
        case "ild::ShapeDrawable":
            return DrawableType.Shape;
        case "ild::ContainerDrawable":
            return DrawableType.Container;
        case "ild::ImageDrawable":
            return DrawableType.Image;
        case "ild::AnimatedDrawable":
            return DrawableType.Animated;
        case "ild::TextDrawable":
            return DrawableType.Text;
        case "ild::TileBlockDrawable":
            return DrawableType.TileBlock;
    }
}

export function drawableTypeToCppType(type : DrawableType) : string {
    switch (type) {
        case DrawableType.Shape:
            return "ild::ShapeDrawable";
        case DrawableType.Container:
            return "ild::ContainerDrawable";
        case DrawableType.Image:
            return "ild::ImageDrawable";
        case DrawableType.Animated:
            return "ild::AnimatedDrawable";
        case DrawableType.Text:
            return "ild::TextDrawable";
        case DrawableType.TileBlock:
            return "ild::TileBlockDrawable";
    }
}


export interface Drawable {
    __cpp_type: string;
    key : string
    renderPriority : number;
    scale : Vector;
    rotation : number;
    inactive : boolean;
    anchor : Vector;
    priorityOffset : number;
}

export let defaultDrawable : Drawable = {
    __cpp_type: null,
    key: "TopDrawable",
    inactive: false,
    renderPriority: 0,
    scale: {
        x: 1,
        y: 1
    },
    rotation: 0,
    anchor: {
        x: 0,
        y: 0
    },
    priorityOffset: 0
};