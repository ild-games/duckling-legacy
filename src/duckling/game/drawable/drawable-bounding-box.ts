import {DisplayObject, Container} from 'pixi.js';

import {Entity} from '../../entitysystem/entity';
import {getPosition} from '../position/position-attribute';
import {Box2, boxUnion} from '../../math';
import {AssetService} from '../../project';
import {isAnimationConstruct, AnimationConstruct, ContainerConstruct, isContainerContruct, DrawnConstruct} from '../../canvas/drawing';

import {drawDrawableAttribute} from './drawable-drawer';

/**
 * Get the bounding box for an entity with a drawable attribute.
 * @param entity The entity the bounding box will be built for.
 * @return A Box2 bounding box for the entity's drawable attribute.
 */
export function drawableBoundingBox(entity : Entity, assetService : AssetService) : Box2 {
    let positionAttribute = getPosition(entity);
    let entityDrawnConstruct = drawDrawableAttribute(entity, assetService);
    if (!positionAttribute || !entityDrawnConstruct) {
        return {
            position: {x: 0, y: 0},
            dimension: {x: 0, y: 0},
            rotation: 0
        };
    }

    let bounds : Box2 = getDrawnConstructBounds(entityDrawnConstruct);
    bounds.position = positionAttribute.position;
    return bounds;
}

function getDrawnConstructBounds(drawnConstruct : DrawnConstruct) : Box2 {
    let bounds : Box2;
    if (isAnimationConstruct(drawnConstruct)) {
        bounds = getAnimationBounds(drawnConstruct as AnimationConstruct);
    } else if (isContainerContruct(drawnConstruct)) {
        bounds = getContainerBounds(drawnConstruct as ContainerConstruct);
    } else {
        bounds = getDisplayObjectBounds(drawnConstruct as DisplayObject);
    }
    return bounds;
}

function getDisplayObjectBounds(displayObject : DisplayObject) : Box2 {
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

function getContainerBounds(container : ContainerConstruct) : Box2 {
    let entireBoundingBox = {
        position: {x: 0, y: 0},
        dimension: {x: 0, y: 0},
        rotation: 0
    };

    for (let childConstruct of container.childConstructs) {
        entireBoundingBox = boxUnion(entireBoundingBox, getDrawnConstructBounds(childConstruct));
    }

    return entireBoundingBox;
}

function getAnimationBounds(animation : AnimationConstruct) : Box2 {
    let bounds = {
        position: {x: 0, y: 0},
        dimension: {x: 0, y: 0},
        rotation: 0
    };
    for (let frame of animation.frames) {
        let frameBounds = getDrawnConstructBounds(frame);

        if (frameBounds.dimension.x > bounds.dimension.x) {
            bounds.dimension.x = frameBounds.dimension.x;
        }
        if (frameBounds.dimension.y > bounds.dimension.y) {
            bounds.dimension.y = frameBounds.dimension.y;
        }
    }
    return bounds;
}
