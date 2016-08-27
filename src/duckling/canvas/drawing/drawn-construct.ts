import {Container, DisplayObject} from 'pixi.js';

/**
 * Animation contains multiple canvas drawn elements that make up the frames of
 * the animation along with a duration for the animation.
 */
export type AnimationConstruct = {
    type: "ANIMATION",
    duration: number,
    frames: DrawnConstruct[]
};

/**
 * Containers contain multiple drawn elements that are manipulated as a group
 */
export type ContainerConstruct = {
    type: "CONTAINER",
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
export function isAnimationConstruct(object : DrawnConstruct) : object is AnimationConstruct {
    return object && (object as AnimationConstruct).type === "ANIMATION";
}

/**
 * Determines if a given DrawnConstruct is a container
 * @param  object DrawnConstruct used to determine if it is a container
 * @return True if the DrawnConstruct is a container, otherwise false.
 */
export function isContainerContruct(object : DrawnConstruct) : object is ContainerConstruct {
    return object && (object as ContainerConstruct).type === "CONTAINER";
}

/**
 * Determines if a given DrawnConstruct is a DisplayObject
 * @param  object DrawnConstruct used to determine if it is a DisplayObject
 * @return True if the DrawnConstruct is a DisplayObject, otherwise false.
 */
export function isDisplayObject(object : DrawnConstruct) : object is DisplayObject {
    return object && !isAnimationConstruct(object) && !isContainerContruct(object);
}

/**
 * Returns an array of pixi DisplayObjects for an array of DrawnConstructs
 * @param  drawnConstructs Array of DrawnConstructs to get the DisplayObjects for
 * @param  totalMillis Total milliseconds passed for the animation frames to consider. Defaults to 0.
 * @return Array of pixi DisplayObjects for rendering.
 */
export function displayObjectsForDrawnConstructs(drawnConstructs : DrawnConstruct[], totalMillis : number = 0) : DisplayObject[] {
    let displayObjects : DisplayObject[] = [];
    for (let drawnConstruct of drawnConstructs) {
        displayObjects.push(displayObjectForDrawnConstruct(drawnConstruct, totalMillis));
    }
    return displayObjects;
}

/**
 * Returns a pixi DisplayObject for a DrawnConstruct
 * @param  drawnConstruct DrawnConstruct to get the DisplayObject for
 * @param  totalMillis Total milliseconds passed for the animation frames to consider. Defaults to 0.
 * @return DisplayObject for rendering.
 */
export function displayObjectForDrawnConstruct(drawnConstruct : DrawnConstruct, totalMillis : number = 0) : DisplayObject {
    if (!drawnConstruct) {
        return null;
    }

    let displayObject : DisplayObject = null;

    if (isAnimationConstruct(drawnConstruct)) {
        displayObject = determineAnimationDisplayObject(drawnConstruct, totalMillis);
    } else if (isContainerContruct(drawnConstruct)) {
        let container = new Container();
        for (let childConstruct of drawnConstruct.childConstructs) {
            let child = displayObjectForDrawnConstruct(childConstruct);
            if (child) {
                container.addChild(child);
            }
        }
        displayObject = container;
    } else if (isDisplayObject(drawnConstruct)) {
        displayObject = drawnConstruct;
    } else {
        throw Error("Unknown DrawnConstruct type in drawn-construct::displayObjectForDrawnConstruct");
    }

    return displayObject;
}

function determineAnimationDisplayObject(animation : AnimationConstruct, totalMillis : number) : DisplayObject {
    let curFrameIndex = 0;
    if (animation.duration !== 0) {
        curFrameIndex = Math.trunc(totalMillis / (animation.duration * 1000)) % animation.frames.length;
    }

    let curFrame = animation.frames[curFrameIndex];
    if (curFrame) {
        return displayObjectForDrawnConstruct(curFrame);
    }
    return new DisplayObject();
}
