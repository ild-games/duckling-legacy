import {Container, DisplayObject, Point, Graphics} from 'pixi.js';

import {Box2, EMPTY_BOX, boxUnion, boxFromWidthHeight} from '../../math/box2';
import {Vector} from '../../math/vector';
import {immutableAssign} from '../../util/model';

export type AnimationConstruct = {
    type: "ANIMATION",
    duration: number,
    frames: DrawnConstruct[],
    position: Vector,
    rotation: number,
    scale: Vector,
    anchor: Vector
};

export type ContainerConstruct = {
    type: "CONTAINER",
    childConstructs: DrawnConstruct[],
    position: Vector,
    rotation: number,
    scale: Vector,
    anchor: Vector
};

type PainterFunction = (position : Vector, graphics : Graphics) => void;
export type PainterConstruct = {
    type: "PAINTER",
    position: Vector,
    painterFunction: PainterFunction
};

export type DrawnConstruct = AnimationConstruct | ContainerConstruct | PainterConstruct | DisplayObject;

export function isDrawnConstruct(object : any) : object is DrawnConstruct {
    return isAnimationConstruct(object) || isContainerConstruct(object) || isDisplayObject(object);
}

export function isAnimationConstruct(object : DrawnConstruct) : object is AnimationConstruct {
    return object && (object as AnimationConstruct).type === "ANIMATION";
}

export function isContainerConstruct(object : DrawnConstruct) : object is ContainerConstruct {
    return object && (object as ContainerConstruct).type === "CONTAINER";
}

export function isPainterConstruct(object : DrawnConstruct) : object is PainterConstruct { 
    return object && (object as PainterConstruct).type === "PAINTER";
}

export function isDisplayObject(object : DrawnConstruct) : object is DisplayObject {
    return object && !isAnimationConstruct(object) && !isContainerConstruct(object) && !isPainterConstruct(object);
}

export function createPainterConstruct(painterFunction : PainterFunction) : PainterConstruct {
    return {
        type: "PAINTER",
        position: {x: 0, y: 0},
        painterFunction
    };
}

/**
 * Returns an array of pixi DisplayObjects for an array of DrawnConstructs
 * @param  drawnConstructs Array of DrawnConstructs to get the DisplayObjects for
 * @param  totalMillis Total milliseconds passed for the animation frames to consider. Defaults to 0.
 * @return Array of pixi DisplayObjects for rendering.
 */
export function displayObjectsForDrawnConstructs(drawnConstructs : DrawnConstruct[], totalMillis : number = 0, graphics : Graphics = new Graphics()) : DisplayObject[] {
    let displayObjects : DisplayObject[] = [];
    for (let drawnConstruct of drawnConstructs) {
        if (drawnConstruct) {
            displayObjects.push(displayObjectForDrawnConstruct(drawnConstruct, graphics, totalMillis));
        }
    }
    return displayObjects.concat([graphics]);
}

/**
 * Returns a pixi DisplayObject for a DrawnConstruct
 * @param  drawnConstruct DrawnConstruct to get the DisplayObject for
 * @param  graphics Graphics object used for PainterConstructs
 * @param  totalMillis Total milliseconds passed for the animation frames to consider. Defaults to 0.
 * @return DisplayObject for rendering.
 */
export function displayObjectForDrawnConstruct(drawnConstruct : DrawnConstruct, graphics : Graphics, totalMillis : number = 0) : DisplayObject {
    if (!drawnConstruct) {
        return null;
    }

    let displayObject : DisplayObject = null;
    if (isAnimationConstruct(drawnConstruct)) {
        displayObject = _displayObjectForAnimationConstruct(drawnConstruct, graphics, totalMillis);
    } else if (isContainerConstruct(drawnConstruct)) {
        displayObject = _displayObjectForContainerConstruct(drawnConstruct, graphics, totalMillis);
    } else if (isPainterConstruct(drawnConstruct)) {
        _displayObjectForPainterConstruct(drawnConstruct, graphics);
    } else if (isDisplayObject(drawnConstruct)) {
        displayObject = drawnConstruct;
    } else {
        throw Error("Unknown DrawnConstruct type in drawn-construct::displayObjectForDrawnConstruct");
    }

    return displayObject;
}

function _displayObjectForAnimationConstruct(animationConstruct : AnimationConstruct, graphics : Graphics, totalMillis : number) : DisplayObject {
    let container = new Container();
    let displayObject = _determineAnimationDisplayObject(animationConstruct, graphics, totalMillis);
    if (displayObject) {
        container.addChild(displayObject);
    }
    _applyDrawnConstructProperties(container, animationConstruct);
    return container;
}

function _displayObjectForContainerConstruct(containerConstruct : ContainerConstruct, graphics : Graphics, totalMillis : number) : DisplayObject {
    let container = new Container();
    for (let childConstruct of containerConstruct.childConstructs) {
        let child = displayObjectForDrawnConstruct(childConstruct, graphics, totalMillis);
        if (child) {
            container.addChild(child);
        }
    }
    _applyDrawnConstructProperties(container, containerConstruct);
    return container;
}

function _displayObjectForPainterConstruct(painterConstruct : PainterConstruct, graphics : Graphics) : void {
    if (!graphics) {
        return;
    }

    painterConstruct.painterFunction(painterConstruct.position, graphics);
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
        return _displayObjectBounds(displayObjectForDrawnConstruct(drawnConstruct, null));
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
            container.addChild(displayObjectForDrawnConstruct(frame, null));
        }
    }
    _applyDrawnConstructProperties(container, animationConstruct);
    return _displayObjectBounds(container);
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

    if (isAnimationConstruct(drawable) || isContainerConstruct(drawable) || isDisplayObject(drawable) || isPainterConstruct(drawable)) {
        _setDisplayObjectPosition(drawable);
    } else {
        throw Error("Unknown DrawnConstruct type in drawable-drawer::_setPosition");
    }
}

function _applyDrawnConstructProperties(container : Container, drawnConstruct : DrawnConstruct) {
    if (isPainterConstruct(drawnConstruct)) {
        return;
    }

    container.position = drawnConstruct.position as Point;
    container.rotation = drawnConstruct.rotation;
    container.scale = drawnConstruct.scale as Point;
    if (isDisplayObject(drawnConstruct)) {
        container.pivot = drawnConstruct.pivot as Point;
    } else {
        container.pivot = drawnConstruct.anchor as Point;
    }
}

function _determineAnimationDisplayObject(animation : AnimationConstruct, graphics : Graphics, totalMillis : number) : DisplayObject {
    let curFrameIndex = 0;
    if (animation.duration !== 0) {
        curFrameIndex = Math.trunc(totalMillis / (animation.duration * 1000)) % animation.frames.length;
    }

    let curFrame = animation.frames[curFrameIndex];
    if (curFrame) {
        return displayObjectForDrawnConstruct(curFrame, graphics);
    }
    return null;
}
