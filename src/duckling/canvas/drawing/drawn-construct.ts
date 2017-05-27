import {Container, DisplayObject, Point, Graphics} from 'pixi.js';

import {Box2, EMPTY_BOX, boxUnion, boxFromWidthHeight} from '../../math/box2';
import {Vector} from '../../math/vector';
import {immutableAssign} from '../../util/model';

export class TransformProperties {
    rotation: number = 0;
    scale: Vector = {x: 0, y: 0};
    anchor: Vector = {x: 0, y: 0};
    position: Vector = {x: 0, y: 0};
}
export type PainterFunction = (graphics : Graphics, transformProperties? : TransformProperties) => void;
export type DrawableFunction = (totalMillis? : number, TransformProperties? : TransformProperties) => DisplayObject;

export class DrawnConstruct {
    painter : PainterFunction;
    drawable : DrawableFunction;
    transformProperties : TransformProperties = new TransformProperties();
    private _layer : number;

    set layer(newLayer : number) {
        this._layer = newLayer;
    }

    get layer() : number {
        if (isNaN(this._layer)) {
            return Number.POSITIVE_INFINITY;
        }
        return this._layer;
    }
}

export class ContainerDrawnConstruct extends DrawnConstruct {
    childConstructs : DrawnConstruct[] = [];
}

export class AnimatedDrawnConstruct extends DrawnConstruct {
    frames : DrawnConstruct[] = [];
    duration : number = 0;
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

    let container = new Container();
    if (drawnConstruct.drawable) {
        let displayObject = drawnConstruct.drawable(1, drawnConstruct.transformProperties);
        container.addChild(displayObject);
        displayObject.updateTransform();
    }
    if (drawnConstruct.painter) {
        let graphics = new Graphics();
        drawnConstruct.painter(graphics, drawnConstruct.transformProperties);
        container.addChild(graphics);
        graphics.updateTransform();
    }

    let containerBounds = container.getBounds();
    return {
        position: {x: containerBounds.x, y: containerBounds.y},
        dimension: {x: containerBounds.width, y: containerBounds.height},
        rotation: 0
    };
}