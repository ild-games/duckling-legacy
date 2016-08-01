import {DisplayObject, Container} from 'pixi.js';

import {Entity} from '../../entitysystem/entity';
import {getPosition} from '../position/position-attribute';
import {Box2, boxUnion} from '../../math';
import {AssetService} from '../../project';
import {isAnimation, Animation, DrawnConstruct} from '../../canvas/drawing';

import {drawDrawableAttribute} from './drawable-drawer';

/**
 * Get the bounding box for an entity with a drawable attribute.
 * @param entity The entity the bounding box will be built for.
 * @return A Box2 bounding box for the entity's drawable attribute.
 */
export function drawableBoundingBox(entity : Entity, assetService : AssetService) : Box2 {
    let positionAttribute = getPosition(entity);
    let entitiesDrawnConstructs = drawDrawableAttribute(entity, assetService);
    if (!positionAttribute || !entitiesDrawnConstructs) {
        return {
            position: {x: 0, y: 0},
            dimension: {x: 0, y: 0},
            rotation: 0
        };
    }

    let entireBoundingBox : Box2 = {
        position: { x: 0, y: 0},
        dimension: { x: 0, y: 0},
        rotation: 0
    };

    for (let entitiesDrawnConstruct of entitiesDrawnConstructs) {
        let bounds = { width: 0, height: 0 };
        if (isAnimation(entitiesDrawnConstruct)) {
            bounds = getAnimationBounds(entitiesDrawnConstruct as Animation);
        } else {
            let container = new Container();
            container.addChild(entitiesDrawnConstruct as DisplayObject);
            (entitiesDrawnConstruct as DisplayObject).updateTransform();
            bounds = container.getBounds();
        }

        entireBoundingBox = boxUnion(entireBoundingBox, {
            position: { x: 0, y: 0},
            dimension: {
                x: bounds.width,
                y: bounds.height
            },
            rotation: 0
        });
    }
    entireBoundingBox.position = positionAttribute.position;
    return entireBoundingBox;
}

function getAnimationBounds(animation : Animation) : {width: number, height: number} {
    let bounds = { width: 0, height: 0 };
    for (let frame of animation.frames) {
        let container = new Container();
        container.addChild(frame);
        frame.updateTransform();
        let frameBounds = container.getBounds();
        if (frameBounds.width > bounds.width) {
            bounds.width = frameBounds.width;
        }
        if (frameBounds.height > bounds.height) {
            bounds.height = frameBounds.height;
        }
    }
    return bounds;
}
