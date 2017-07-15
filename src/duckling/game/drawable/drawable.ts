import {Vector} from '../../math';
import {immutableAssign} from '../../util';

import {defaultShapeDrawable} from './shape-drawable';
import {defaultContainerDrawable, ContainerDrawable} from './container-drawable';
import {defaultAnimatedDrawable, AnimatedDrawable} from './animated-drawable';
import {defaultImageDrawable} from './image-drawable';
import {defaultTileBlockDrawable} from './tile-block-drawable';
import {defaultTextDrawable} from './text-drawable';

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
    key : string;
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

/**
 * Gets the default drawable based on the given DrawableType
 * @param  type Type of the drawable
 * @return Default drawable implementation for the given type
 */
export function getDefaultDrawable(type : DrawableType) : Drawable {
    switch (type) {
        default:
            return null;
        case DrawableType.Shape:
            return defaultShapeDrawable;
        case DrawableType.Container:
            return defaultContainerDrawable;
        case DrawableType.Image:
            return defaultImageDrawable;
        case DrawableType.TileBlock:
            return defaultTileBlockDrawable;
        case DrawableType.Animated:
            return defaultAnimatedDrawable;
        case DrawableType.Text:
            return defaultTextDrawable;
    }
}

export function newDrawable(type : DrawableType, existingDrawables : Drawable[]) {
    let defaultDrawable = getDefaultDrawable(type);
    return immutableAssign(
        defaultDrawable, 
        {key: defaultDrawable.key + _findNextUniqueKey(type, defaultDrawable.key, existingDrawables)});
}

export function cloneDrawable(drawable : Drawable, existingDrawables : Drawable[]) {
    let drawableType = cppTypeToDrawableType(drawable.__cpp_type);
    let defaultKey = getDefaultDrawable(drawableType).key;
    return immutableAssign(
        drawable,
        {key: defaultKey + _findNextUniqueKey(drawableType, defaultKey, existingDrawables)});
}

function _findNextUniqueKey(pickedType : DrawableType, defaultKey : string, existingDrawables : Drawable[]) {
    let lastKey = 0;
    for (let drawable of existingDrawables) {
        if (drawable.__cpp_type === drawableTypeToCppType(pickedType)) {
            let keyNum : number = +drawable.key.split(defaultKey)[1];
            if (keyNum > lastKey) {
                lastKey = keyNum;
            }
        }
    }
    return ++lastKey;
}