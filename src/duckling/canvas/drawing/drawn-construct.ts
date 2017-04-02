import {Container, DisplayObject, Point} from 'pixi.js';

import {Box2, EMPTY_BOX, boxUnion, boxFromWidthHeight} from '../../math/box2';
import {Vector} from '../../math/vector';
import {immutableAssign} from '../../util/model';

/**
 * Animation contains multiple canvas drawn elements that make up the frames of
 * the animation along with a duration for the animation.
 */
export type AnimationConstruct = {
    type: "ANIMATION",
    duration: number,
    frames: DrawnConstruct[],
    position: Vector,
    rotation: number,
    scale: Vector,
    anchor: Vector
};

/**
 * Containers contain multiple drawn elements that are manipulated as a group
 */
export type ContainerConstruct = {
    type: "CONTAINER",
    childConstructs: DrawnConstruct[],
    position: Vector,
    rotation: number,
    scale: Vector,
    anchor: Vector
};

/**
 * DrawnConstruct is either an Animation or a single DisplayObject, used to represent
 * the types that can be drawn by the map
 */
export type DrawnConstruct = AnimationConstruct | ContainerConstruct | DisplayObject;

/**
 * Determines if a given object is a DrawnConstruct
 * @param  object object used to determine if it is an DrawnConstruct
 * @return True if the object is a DrawnConstruct, otherwise false.
 */
export function isDrawnConstruct(object : any) : object is DrawnConstruct {
    return isAnimationConstruct(object) || isContainerConstruct(object) || isDisplayObject(object);
}

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
export function isContainerConstruct(object : DrawnConstruct) : object is ContainerConstruct {
    return object && (object as ContainerConstruct).type === "CONTAINER";
}

/**
 * Determines if a given DrawnConstruct is a DisplayObject
 * @param  object DrawnConstruct used to determine if it is a DisplayObject
 * @return True if the DrawnConstruct is a DisplayObject, otherwise false.
 */
export function isDisplayObject(object : DrawnConstruct) : object is DisplayObject {
    return object && !isAnimationConstruct(object) && !isContainerConstruct(object);
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
        displayObject = _displayObjectForAnimationConstruct(drawnConstruct, totalMillis);
    } else if (isContainerConstruct(drawnConstruct)) {
        displayObject = _displayObjectForContainerConstruct(drawnConstruct, totalMillis);
    } else if (isDisplayObject(drawnConstruct)) {
        displayObject = drawnConstruct;
    } else {
        throw Error("Unknown DrawnConstruct type in drawn-construct::displayObjectForDrawnConstruct");
    }

    return displayObject;
}

function _displayObjectForAnimationConstruct(animationConstruct : AnimationConstruct, totalMillis : number) : DisplayObject {
    let container = new Container();
    let displayObject = _determineAnimationDisplayObject(animationConstruct, totalMillis);
    if (displayObject) {
        container.addChild(displayObject);
    }
    _applyDrawnConstructProperties(container, animationConstruct);
    return container;
}

function _displayObjectForContainerConstruct(containerConstruct : ContainerConstruct, totalMillis : number) : DisplayObject {
    let container = new Container();
    for (let childConstruct of containerConstruct.childConstructs) {
        let child = displayObjectForDrawnConstruct(childConstruct, totalMillis);
        if (child) {
            container.addChild(child);
        }
    }
    _applyDrawnConstructProperties(container, containerConstruct);
    return container;
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
    if (!isDrawnConstruct(drawnConstruct)) {
        throw Error("Unknown DrawnConstruct type in drawable-bounding-box::getDrawnConstructBounds");
    }

    if (isAnimationConstruct(drawnConstruct)) {
        return _animationBounds(drawnConstruct);
    } else {
        return _displayObjectBounds(displayObjectForDrawnConstruct(drawnConstruct));
    }
}

function _displayObjectBounds(displayObject : DisplayObject) : Box2 {
    if (!displayObject) {
        return null;
    }

    let container = new Container();
    container.addChild(displayObject);
    displayObject.updateTransform();
    let displayObjectBounds = container.getBounds();
    return {
        position: {x: displayObjectBounds.x, y: displayObjectBounds.y},
        dimension: {x: displayObjectBounds.width, y: displayObjectBounds.height},
        rotation: 0
    };
}

/**
 * Animation bounds are the union of all the frames
 */
function _animationBounds(animationConstruct : AnimationConstruct) : Box2 {
    let container = new Container();
    for (let frame of animationConstruct.frames) {
        if (frame) {
            container.addChild(displayObjectForDrawnConstruct(frame));
        }
    }
    _applyDrawnConstructProperties(container, animationConstruct);
    let outerContainer = new Container();
    outerContainer.addChild(container);
    container.updateTransform();
    let displayObjectBounds = outerContainer.getBounds();
    return {
        position: {x: displayObjectBounds.x, y: displayObjectBounds.y},
        dimension: {x: displayObjectBounds.width, y: displayObjectBounds.height},
        rotation: 0
    };
}

/**
 * Set the position of a drawn construct
 * @param  drawable Drawn construct to set the position of
 * @param  position Position to apply to the drawn construct
 */
export function setConstructPosition(drawable : DrawnConstruct, position : Vector) {
    function _setDisplayObjectPosition(displayObject : DrawnConstruct) {
        displayObject.position.x += position.x;
        displayObject.position.y += position.y;
    }
    if (!drawable) {
        return;
    }

    if (isAnimationConstruct(drawable) || isContainerConstruct(drawable) || isDisplayObject(drawable)) {
        _setDisplayObjectPosition(drawable);
    } else {
        throw Error("Unknown DrawnConstruct type in drawable-drawer::_setPosition");
    }
}

function _applyDrawnConstructProperties(container : Container, drawnConstruct : DrawnConstruct) {
    container.position = drawnConstruct.position as Point;
    container.rotation = drawnConstruct.rotation;
    container.scale = drawnConstruct.scale as Point;
    if (isDisplayObject(drawnConstruct)) {
        container.pivot = drawnConstruct.pivot as Point;
    } else {
        container.pivot = drawnConstruct.anchor as Point;
    }
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
