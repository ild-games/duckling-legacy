import {DisplayObject, Container} from 'pixi.js';

import {Entity} from '../../entitysystem/entity';
import {getPosition} from '../position/position-attribute';
import {Box2, boxUnion, EMPTY_BOX} from '../../math';
import {AssetService} from '../../project';
import {immutableAssign} from '../../util';
import {isAnimationConstruct, AnimationConstruct, ContainerConstruct, isContainerContruct, isDisplayObject, DrawnConstruct} from '../../canvas/drawing';

import {drawDrawableAttribute} from './drawable-drawer';

/**
 * Get the bounding box for an entity with a drawable attribute.
 * @param entity The entity the bounding box will be built for.
 * @return A Box2 bounding box for the entity's drawable attribute.
 */
export function drawableBoundingBox(entity : Entity, assetService : AssetService) : Box2 {
    let entityDrawnConstruct = drawDrawableAttribute(entity, assetService);
    let position = getPosition(entity);
    if (!position || !entityDrawnConstruct) {
        return null;
    }

    let bounds : Box2 = getDrawnConstructBounds(entityDrawnConstruct);
    if (!bounds) {
        return null;
    }
    return immutableAssign(bounds, {position: position.position});
}

function getDrawnConstructBounds(drawnConstruct : DrawnConstruct) : Box2 {
    if (!drawnConstruct) {
        return null;
    }

    let bounds : Box2;
    if (isAnimationConstruct(drawnConstruct)) {
        bounds = getAnimationBounds(drawnConstruct);
    } else if (isContainerContruct(drawnConstruct)) {
        bounds = getContainerBounds(drawnConstruct);
    } else if (isDisplayObject(drawnConstruct)) {
        bounds = getDisplayObjectBounds(drawnConstruct);
    } else {
        throw Error("Unknown DrawnConstruct type in drawable-bounding-box::getDrawnConstructBounds");
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
    return getUnionedBounds(container.childConstructs);
}

function getAnimationBounds(animation : AnimationConstruct) : Box2 {
    return getUnionedBounds(animation.frames);
}

function getUnionedBounds(drawnConstructs : DrawnConstruct[]) : Box2 {
    let entireBoundingBox = EMPTY_BOX;
    for (let construct of drawnConstructs) {
        let childBox = getDrawnConstructBounds(construct);
        if (childBox) {
            entireBoundingBox = boxUnion(entireBoundingBox, childBox);
        }
    }
    return entireBoundingBox;
}
