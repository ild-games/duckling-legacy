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

    draw(totalMillis : number) : DisplayObject {
        return this._drawable(totalMillis);
    }

    paint(graphics : Graphics) {
    }

    protected _drawable(totalMillis : number) : DisplayObject {
        return null;
    }

    protected _applyDisplayObjectTransforms(displayObject : DisplayObject) {
        if (this.transformProperties.anchor) {
            let bounds : Box2;
            if (this.transformProperties.anchor.x !== 0.0 || this.transformProperties.anchor.y !== 0.0) {
                bounds = this._displayObjectBounds(displayObject);
            }
            if (this.transformProperties.anchor.x !== 0.0) {
                displayObject.pivot.x = bounds.dimension.x * this.transformProperties.anchor.x;
            }
            if (this.transformProperties.anchor.y !== 0.0) {
                displayObject.pivot.y = bounds.dimension.y * this.transformProperties.anchor.y;
            }
        }

        if (this.transformProperties.rotation !== undefined && this.transformProperties.rotation !== null) {
            displayObject.rotation = degreesToRadians(this.transformProperties.rotation);
        }

        if (this.transformProperties.scale) {
            displayObject.scale.x = this.transformProperties.scale.x;
            displayObject.scale.y = this.transformProperties.scale.y;
        }

        if (this.transformProperties.position) {
            displayObject.position.x = this.transformProperties.position.x;
            displayObject.position.y = this.transformProperties.position.y;
        }
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
    let displayObject = drawnConstruct.draw(1);
    if (displayObject) {
        container.addChild(displayObject);
        displayObject.updateTransform();
    }
    let graphics = new Graphics();
    drawnConstruct.paint(graphics);
    container.addChild(graphics);
    graphics.updateTransform();

    let containerBounds = container.getBounds();
    return {
        position: {x: containerBounds.x, y: containerBounds.y},
        dimension: {x: containerBounds.width, y: containerBounds.height},
        rotation: 0
    };
}