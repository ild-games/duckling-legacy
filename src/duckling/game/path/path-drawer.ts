import {Graphics, DisplayObject, Container, Point} from 'pixi.js';

import {DrawnConstruct, TransformProperties} from '../../canvas/drawing';
import {Entity} from '../../entitysystem/entity';
import {drawRectangle} from '../../canvas/drawing/util';
import {Vector, vectorRotate} from '../../math/vector';
import {AttributeDrawer} from '../../canvas/drawing/entity-drawer.service';

import {PathAttribute} from './path-attribute';

export const PATH_HEIGHT = 4;
const VERTEX_MARKER_HEIGHT = 2 * PATH_HEIGHT;
const TRIANGLE_HEIGHT = 2 * VERTEX_MARKER_HEIGHT;
const DIRECTION_INDICATOR_OFFSET = VERTEX_MARKER_HEIGHT / 2;
const JOINT_HEIGHT = VERTEX_MARKER_HEIGHT;
const PATH_COLOR = 0x607d8b;
const STARTING_SQUARE_COLOR = 0x00a626;
const ENDING_SQUARE_COLOR = 0xf44336;

export function getPathAttributeDrawnConstruct(pathAttribute : PathAttribute) : DrawnConstruct {
    if (!pathAttribute) {
        return null;
    }

    let drawnConstruct = new PathDrawnConstruct();
    drawnConstruct.layer = Number.POSITIVE_INFINITY;
    drawnConstruct.vertices = pathAttribute.vertices;
    drawnConstruct.isLoop = pathAttribute.isLoop;
    return drawnConstruct;
}

class PathDrawnConstruct extends DrawnConstruct {
    vertices : Vector[];
    isLoop : boolean;

    drawable(totalMillis : number) : DisplayObject {
        let displayObject = this._pathDrawable();
        if (displayObject) {
            displayObject.position = this.transformProperties.position as Point;
        }
        return displayObject;
    }

    private _pathDrawable() : DisplayObject {
        if (this.vertices.length === 0) {
            return null;
        }

        if (this.isLoop) {
            return this._drawLoop();
        } else {
            return this._drawNonLoopPath();
        }
    }

    private _drawLoop() : DisplayObject {
        if (this.vertices.length === 1) {
            return this._drawJoint(this.vertices[0]);
        }

        return this._drawLoopPath();
    }

    private _drawNonLoopPath() : DisplayObject {
        if (this.vertices.length === 1) {
            return this._drawJoint(this.vertices[0]);
        }

        if (this.vertices.length === 2) {
            let container = new Container();
            let theta = this._pathTheta(this.vertices[0], this.vertices[1]);
            container.addChild(this._drawLine(this.vertices[0], this.vertices[1]));
            container.addChild(this._drawSquare(this.vertices[0], theta, STARTING_SQUARE_COLOR));
            container.addChild(this._drawSquare(this.vertices[1], theta, ENDING_SQUARE_COLOR));
            return container;
        }

        return this._drawPath();
    }

    private _drawLoopPath() : DisplayObject {
        let container = new Container();
        for (let i = 0; i < this.vertices.length - 1; i++) {
            let startVertex = this.vertices[i];
            let endVertex = this.vertices[i + 1];
            container.addChild(this._drawLine(startVertex, endVertex));
            container.addChild(this._drawJoint(endVertex));
        }
        container.addChild(this._drawLine(this.vertices[this.vertices.length - 1], this.vertices[0]));

        // draw the loop indicator last so that it will be drawn on top of other segments
        container.addChild(this._drawLoopIndicator(this.vertices[0], this._pathTheta(this.vertices[0], this.vertices[1])));
        return container;
    }

    private _drawLoopIndicator(vertex : Vector, theta : number) : DisplayObject {
        let container = new Container();

        container.addChild(this._drawSquare(vertex, 0, STARTING_SQUARE_COLOR));
        container.addChild(this._drawTriangle({x: vertex.x + DIRECTION_INDICATOR_OFFSET, y: vertex.y}, STARTING_SQUARE_COLOR));

        return this._rotateDisplayObject(container, theta, vertex);
    }

    private _drawPath() : DisplayObject {
        let container = new Container();

        for (let i = 0; i < this.vertices.length - 1; i++) {
            let startVertex = this.vertices[i];
            let endVertex = this.vertices[i + 1];
            container.addChild(this._drawLine(startVertex, endVertex));
            container.addChild(this._drawJoint(endVertex));
        }

        let firstSquareTheta = this._pathTheta(this.vertices[0], this.vertices[1]);
        container.addChild(this._drawSquare(this.vertices[0], firstSquareTheta, STARTING_SQUARE_COLOR));
        let secondSquareTheta = this._pathTheta(this.vertices[this.vertices.length - 2], this.vertices[this.vertices.length - 1]);
        container.addChild(this._drawSquare(this.vertices[this.vertices.length - 1], secondSquareTheta, ENDING_SQUARE_COLOR));

        return container;
    }

    private _drawLine(startVertex : Vector, endVertex : Vector) : DisplayObject {
        let graphics = new Graphics();
        graphics.lineStyle(PATH_HEIGHT, PATH_COLOR);
        graphics.moveTo(startVertex.x, startVertex.y);
        graphics.lineTo(endVertex.x, endVertex.y);
        return graphics;
    }

    private _drawSquare(position : Vector, theta : number, color : number = PATH_COLOR) : DisplayObject {
        let graphics = new Graphics();
        graphics.beginFill(color);
        graphics.drawRect(position.x - (VERTEX_MARKER_HEIGHT / 2), position.y - (VERTEX_MARKER_HEIGHT / 2), VERTEX_MARKER_HEIGHT, VERTEX_MARKER_HEIGHT);
        graphics.endFill();
        return this._rotateDisplayObject(graphics, theta, position);
    }

    private _drawTriangle(position : Vector, color : number = PATH_COLOR) : DisplayObject {
        let graphics = new Graphics();
        graphics.beginFill(color);
        graphics.moveTo(position.x, position.y - (TRIANGLE_HEIGHT / 2));
        graphics.lineTo(position.x + (TRIANGLE_HEIGHT / 2), position.y);
        graphics.lineTo(position.x, position.y + (TRIANGLE_HEIGHT / 2));
        graphics.lineTo(position.x, position.y - (TRIANGLE_HEIGHT / 2));
        graphics.endFill();
        return graphics;
    }

    private _drawJoint(position : Vector) : DisplayObject {
        let graphics = new Graphics();
        graphics.beginFill(PATH_COLOR);
        graphics.drawCircle(position.x, position.y, JOINT_HEIGHT / 2);
        graphics.endFill();
        return graphics;
    }

    private _rotateDisplayObject(drawnObject : DisplayObject, theta : number, rotateAround : Vector) : DisplayObject {
        drawnObject.rotation = theta;
        drawnObject.pivot.x = rotateAround.x;
        drawnObject.pivot.y = rotateAround.y;
        drawnObject.x = rotateAround.x;
        drawnObject.y = rotateAround.y;
        return drawnObject;
    }

    private _pathTheta(startVertex : Vector, endVertex : Vector) : number {
        return Math.atan2(endVertex.y - startVertex.y, endVertex.x - startVertex.x);
    }
}