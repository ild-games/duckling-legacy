import {Container, DisplayObject, Point, Graphics} from 'pixi.js';

import {Box2, EMPTY_BOX, boxUnion, boxFromWidthHeight} from '../../math/box2';
import {Vector} from '../../math/vector';
import {degreesToRadians} from '../../math/number-utils';
import {immutableAssign} from '../../util/model';

export class TransformProperties {
    rotation: number = 0;
    scale: Vector = {x: 0, y: 0};
    anchor: Vector = {x: 0, y: 0};
    position: Vector = {x: 0, y: 0};
}

export class DrawnConstruct {
    transformProperties : TransformProperties = new TransformProperties();
    private _layer : number;

    drawable(totalMillis : number) : DisplayObject {
        return null;
    }

    paint(graphics : Graphics) {
    }

    protected _applyDisplayObjectTransforms(displayObject : DisplayObject) {
        let bounds = this._displayObjectBounds(displayObject);
        displayObject.rotation = degreesToRadians(this.transformProperties.rotation);
        displayObject.scale = this.transformProperties.scale as Point;
        displayObject.pivot.x = bounds.dimension.x * this.transformProperties.anchor.x;
        displayObject.pivot.y = bounds.dimension.y * this.transformProperties.anchor.y;
        displayObject.position = this.transformProperties.position as Point;
    }

    private _displayObjectBounds(displayObject : DisplayObject) : Box2 {
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
        let displayObject = drawnConstruct.drawable(1);
        container.addChild(displayObject);
        displayObject.updateTransform();
    }
    if (drawnConstruct.paint) {
        let graphics = new Graphics();
        drawnConstruct.paint(graphics);
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