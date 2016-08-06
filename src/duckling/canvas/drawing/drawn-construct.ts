import {Container, DisplayObject} from 'pixi.js';

/**
 * Animation contains multiple canvas drawn elements that make up the frames of
 * the animation along with a duration for the animation.
 */
export type AnimationConstruct = {
    duration: number,
    frames: DrawnConstruct[]
};

/**
 * Containers contain multiple drawn elements that are manipulated as a group
 */
export type ContainerConstruct = {
    childConstructs: DrawnConstruct[]
};

/**
 * DrawnConstruct is either an Animation or a single DisplayObject, used to represent
 * the types that can be drawn by the map
 */
export type DrawnConstruct = AnimationConstruct | ContainerConstruct | DisplayObject;

/**
 * Determines if a given DrawnConstruct is an animation
 * @param  object DrawnConstruct used to determine if it is an animation
 * @return True if the DrawnConstruct is an animation, otherwise false.
 */
export function isAnimationConstruct(object : DrawnConstruct) : boolean {
    return object !== undefined && object.hasOwnProperty('duration') && object.hasOwnProperty('frames');
}

/**
 * Determines if a given DrawnConstruct is a container
 * @param  object DrawnConstruct used to determine if it is a container
 * @return True if the DrawnConstruct is a container, otherwise false.
 */
export function isContainerContruct(object : DrawnConstruct) : boolean {
    return object !== undefined && object.hasOwnProperty('childConstructs');
}
