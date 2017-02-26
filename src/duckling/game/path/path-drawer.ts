import {Graphics, DisplayObject, Container} from 'pixi.js';

import {DrawnConstruct} from '../../canvas/drawing';
import {Entity} from '../../entitysystem/entity';
import {drawRectangle} from '../../canvas/drawing/util';
import {Vector, vectorRotate} from '../../math/vector';

import {getPath} from './path-attribute';

export const PATH_HEIGHT = 4;
const VERTEX_MARKER_HEIGHT = 2 * PATH_HEIGHT;
const TRIANGLE_HEIGHT = 2 * VERTEX_MARKER_HEIGHT;
const DIRECTION_INDICATOR_OFFSET = VERTEX_MARKER_HEIGHT / 2;
const JOINT_HEIGHT = VERTEX_MARKER_HEIGHT;
const PATH_COLOR = 0x607d8b;
const STARTING_SQUARE_COLOR = 0x00a626;
const ENDING_SQUARE_COLOR = 0xf44336;

export function drawPathAttribute(entity : Entity) : DrawnConstruct {
    let pathAttribute = getPath(entity);
    if (!pathAttribute || pathAttribute.vertices.length === 0) {
        return null;
    }

    if (pathAttribute.vertices.length === 1) {
        return _drawJoint({x: 0, y: 0});
    }
    
    if (pathAttribute.vertices.length === 2 && !pathAttribute.isLoop) {
        let container = new Container();
        let theta = _pathTheta(pathAttribute.vertices[0], pathAttribute.vertices[1]);
        container.addChild(_drawLine(pathAttribute.vertices[0], pathAttribute.vertices[1]));
        container.addChild(_drawSquare(pathAttribute.vertices[0], theta, STARTING_SQUARE_COLOR));
        container.addChild(_drawSquare(pathAttribute.vertices[1], theta, ENDING_SQUARE_COLOR));
        return container;
    }
    
    if (pathAttribute.isLoop) {
        return _drawLoopPath(pathAttribute.vertices);
    } 
    return _drawPath(pathAttribute.vertices);
}

function _drawLoopPath(vertices : Vector[]) : DisplayObject {
    let container = new Container();
    for (let i = 0; i < vertices.length - 1; i++) {
        let startVertex = vertices[i];
        let endVertex = vertices[i + 1];
        container.addChild(_drawLine(startVertex, endVertex));
        container.addChild(_drawJoint(endVertex));
    }
    container.addChild(_drawLine(vertices[vertices.length - 1], vertices[0]));
    
    // draw the loop indicator last so that it will be drawn on top of other segments
    container.addChild(_drawLoopIndicator(vertices[0], _pathTheta(vertices[0], vertices[1])));
    return container;
}

function _drawLoopIndicator(vertex : Vector, theta : number) : DisplayObject {
    let container = new Container();
    
    container.addChild(_drawSquare(vertex, 0, STARTING_SQUARE_COLOR));
    container.addChild(_drawTriangle({x: vertex.x + DIRECTION_INDICATOR_OFFSET, y: vertex.y}, STARTING_SQUARE_COLOR));

    return _rotateDisplayObject(container, theta, vertex);
}

function _drawPath(vertices : Vector[]) : DisplayObject {
    let container = new Container();
    
    for (let i = 0; i < vertices.length - 1; i++) {
        let startVertex = vertices[i];
        let endVertex = vertices[i + 1];
        container.addChild(_drawLine(startVertex, endVertex));
        container.addChild(_drawJoint(endVertex));
    }
    
    let firstSquareTheta = _pathTheta(vertices[0], vertices[1]);
    container.addChild(_drawSquare(vertices[0], firstSquareTheta, STARTING_SQUARE_COLOR));
    let secondSquareTheta = _pathTheta(vertices[vertices.length - 2], vertices[vertices.length - 1]);
    container.addChild(_drawSquare(vertices[vertices.length - 1], secondSquareTheta, ENDING_SQUARE_COLOR));
        
    return container;
}

function _drawLine(startVertex : Vector, endVertex : Vector) : DisplayObject {
    let graphics = new Graphics();
    graphics.lineStyle(PATH_HEIGHT, PATH_COLOR);
    graphics.moveTo(startVertex.x, startVertex.y);
    graphics.lineTo(endVertex.x, endVertex.y);
    return graphics;
}

function _drawSquare(position : Vector, theta : number, color : number = PATH_COLOR) : DisplayObject {
    let graphics = new Graphics();
    graphics.beginFill(color);
    graphics.drawRect(position.x - (VERTEX_MARKER_HEIGHT / 2), position.y - (VERTEX_MARKER_HEIGHT / 2), VERTEX_MARKER_HEIGHT, VERTEX_MARKER_HEIGHT);
    graphics.endFill();
    return _rotateDisplayObject(graphics, theta, position);
}

function _drawTriangle(position : Vector, color : number = PATH_COLOR) : DisplayObject {
    let graphics = new Graphics();
    graphics.beginFill(color);
    graphics.moveTo(position.x, position.y - (TRIANGLE_HEIGHT / 2));
    graphics.lineTo(position.x + (TRIANGLE_HEIGHT / 2), position.y);
    graphics.lineTo(position.x, position.y + (TRIANGLE_HEIGHT / 2));
    graphics.lineTo(position.x, position.y - (TRIANGLE_HEIGHT / 2));
    graphics.endFill();
    return graphics;
}

function _drawJoint(position : Vector) : DisplayObject {
    let graphics = new Graphics();
    graphics.beginFill(PATH_COLOR);
    graphics.drawCircle(position.x, position.y, JOINT_HEIGHT / 2);
    graphics.endFill();
    return graphics;
}

function _drawFirstLoopJoint(position: Vector) : DisplayObject {
    let container = new Container();
    container.addChild(_drawTriangle(position, STARTING_SQUARE_COLOR));
    return container;
}

function _rotateDisplayObject(drawnObject : DisplayObject, theta : number, rotateAround : Vector) : DisplayObject {
    drawnObject.rotation = theta;
    drawnObject.pivot.x = rotateAround.x;
    drawnObject.pivot.y = rotateAround.y;
    drawnObject.x = rotateAround.x;
    drawnObject.y = rotateAround.y;
    return drawnObject;
}

function _pathTheta(startVertex : Vector, endVertex : Vector) : number {
    return Math.atan2(endVertex.y - startVertex.y, endVertex.x - startVertex.x);
}