import {Container, DisplayObject} from 'pixi.js';

import {Box2, EMPTY_BOX, boxUnion} from '../../math/box2';

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
        if (drawnConstruct) {
            displayObjects.push(displayObjectForDrawnConstruct(drawnConstruct, totalMillis));
        }
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
        displayObject = _determineAnimationDisplayObject(drawnConstruct, totalMillis);
    } else if (isContainerContruct(drawnConstruct)) {
        let container = new Container();
        for (let childConstruct of drawnConstruct.childConstructs) {
            let child = displayObjectForDrawnConstruct(childConstruct, totalMillis);
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

/**
 * Given a drawn construct, return the bounds
 * @param  drawnConstruct Drawn construct to get the bounds for
 * @return The bounds of the drawn construct
 */
export function drawnConstructBounds(drawnConstruct : DrawnConstruct) : Box2 {
    if (!drawnConstruct) {
        return null;
    }

    let bounds : Box2;
    if (isAnimationConstruct(drawnConstruct)) {
        bounds = _animationBounds(drawnConstruct);
    } else if (isContainerContruct(drawnConstruct)) {
        bounds = _containerBounds(drawnConstruct);
    } else if (isDisplayObject(drawnConstruct)) {
        bounds = _displayObjectBounds(drawnConstruct);
    } else {
        throw Error("Unknown DrawnConstruct type in drawable-bounding-box::getDrawnConstructBounds");
    }
    return bounds;
}

function _containerBounds(container : ContainerConstruct) : Box2 {
    return _unionedBounds(container.childConstructs);
}

function _animationBounds(animation : AnimationConstruct) : Box2 {
    return _unionedBounds(animation.frames);
}

function _unionedBounds(drawnConstructs : DrawnConstruct[]) : Box2 {
    let entireBoundingBox = EMPTY_BOX;
    for (let construct of drawnConstructs) {
        let childBox = drawnConstructBounds(construct);
        if (childBox) {
            entireBoundingBox = boxUnion(entireBoundingBox, childBox);
        }
    }
    return entireBoundingBox;
}

function _displayObjectBounds(displayObject : DisplayObject) : Box2 {
    let container = new Container();
    container.addChild(displayObject);
    displayObject.updateTransform();
    let displayObjectBounds = container.getBounds();
    return {
        position: {x: 0, y: 0},
        dimension: {
            x: displayObjectBounds.width,
            y: displayObjectBounds.height
        },
        rotation: 0
    };
}

function _determineAnimationDisplayObject(animation : AnimationConstruct, totalMillis : number) : DisplayObject {
    let curFrameIndex = 0;
    if (animation.duration !== 0) {
        curFrameIndex = Math.trunc(totalMillis / (animation.duration * 1000)) % animation.frames.length;
    }

    let curFrame = animation.frames[curFrameIndex];
    if (curFrame) {
        return displayObjectForDrawnConstruct(curFrame);
    }
    return null;
}
