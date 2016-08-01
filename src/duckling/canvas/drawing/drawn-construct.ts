import {Container, DisplayObject} from 'pixi.js';

export type Animation = {
    duration: number,
    frames: DisplayObject[]
};
export type DrawnConstruct = Animation | DisplayObject;

export function isAnimation(object : DrawnConstruct) {
    return Array.isArray((object as Animation).frames);
}
