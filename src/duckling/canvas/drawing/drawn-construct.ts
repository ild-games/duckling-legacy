import {Container, DisplayObject} from 'pixi.js';

/**
 * Animation contains multiple canvas drawn elements that make up the frames of
 * the animation along with a duration for the animation.
 */
export type Animation = {
    duration: number,
    frames: DisplayObject[]
};

/**
 * DrawnConstruct is either an Animation or a single DisplayObject, used to represent
 * the types that can be drawn by the map
 */
export type DrawnConstruct = Animation | DisplayObject;

/**
 * Determines if a given DrawnConstruct is an animation or not.
 * @param  object DrawnConstruct used to determine if it is an animation
 * @return True if the DrawnConstruct is an animation, otherwise false.
 */
export function isAnimation(object : DrawnConstruct) : boolean {
    return Array.isArray((object as Animation).frames);
}
