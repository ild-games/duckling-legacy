import {Vector} from '../../math';

import {ContainerDrawable} from './container-drawable';
import {AnimatedDrawable} from './animated-drawable';

export enum DrawableType {
    Shape,
    Container,
    Image,
    Animated,
    Text
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
    key: "topDrawable",
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

export function getDrawableByKey(parentDrawable : Drawable, key : string) : Drawable {
    if (key === parentDrawable.key) {
        return parentDrawable;
    }

    switch (cppTypeToDrawableType(parentDrawable.__cpp_type)) {
        case DrawableType.Container:
            return findDrawableInArray(key, (parentDrawable as ContainerDrawable).drawables);
        case DrawableType.Animated:
            return findDrawableInArray(key, (parentDrawable as AnimatedDrawable).frames);
        default:
            return null;
    }
}

function findDrawableInArray(key : string, drawables : Drawable[]) : Drawable {
    for (let drawable of drawables) {
        let childByKey = getDrawableByKey(drawable, key);
        if (childByKey) {
            return childByKey;
        }
    }
    return null;
}