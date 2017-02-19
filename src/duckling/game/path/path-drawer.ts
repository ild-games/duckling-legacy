import {Graphics, DisplayObject, Container} from 'pixi.js';

import {DrawnConstruct} from '../../canvas/drawing';
import {Entity} from '../../entitysystem/entity';
import {drawRectangle} from '../../canvas/drawing/util';
import {Vector, vectorRotate} from '../../math/vector';

import {getPath} from './path-attribute';

export const PATH_HEIGHT = 20;
const PATH_COLOR = 0x607d8b;
const STARTING_SQUARE_COLOR = 0x00e676;
const ENDING_SQUARE_COLOR = 0xf44336;

export function drawPathAttribute(entity : Entity) : DrawnConstruct {
    let pathAttribute = getPath(entity);
    if (!pathAttribute || pathAttribute.vertices.length === 0) {
        return null;
    }

    if (pathAttribute.vertices.length === 1) {
        return _drawJoint(0, 0);
    }
    
    if (pathAttribute.vertices.length === 2 && !pathAttribute.isLoop) {
        return _drawSegmentWithBothSquares(pathAttribute.vertices[0], pathAttribute.vertices[1]);
    }
    
    if (!pathAttribute.isLoop) {
        return _drawPath(pathAttribute.vertices);
    } else {
        return _drawLoopPath(pathAttribute.vertices);
    }
}

function _drawLoopPath(vertices : Vector[]) : DisplayObject {
    let container = new Container();
    for (let i = 1; i < vertices.length - 1; i++) {
        let startVertex = vertices[i];
        let endVertex = vertices[i + 1];
        container.addChild(_drawLine(startVertex, endVertex));
        container.addChild(_drawJoint(endVertex.x, endVertex.y));
    }
    container.addChild(_drawLine(vertices[vertices.length - 1], vertices[0]));
    
    // draw the first loop last so the indicator will be drawn on top of other segments
    container.addChild(_drawFirstLoopSegment(vertices[0], vertices[1]));
    return container;
}

function _drawFirstLoopSegment(startVertex : Vector, endVertex : Vector) : DisplayObject {
    let container = new Container();
    let rotatedEndVertex = vectorRotate(endVertex, -_pathTheta(startVertex, endVertex), startVertex);
    
    container.addChild(_drawLine(startVertex, rotatedEndVertex));
    container.addChild(_drawFirstLoopJoint(startVertex.x, startVertex.y));
    container.addChild(_drawJoint(rotatedEndVertex.x, rotatedEndVertex.y));
    
    return _rotateSegemnt(container, _pathTheta(startVertex, endVertex), startVertex);
}

function _drawPath(vertices : Vector[]) : DisplayObject {
    let container = new Container();
    container.addChild(_drawSegmentWithLeftSquare(vertices[0], vertices[1]));
    container.addChild(_drawJoint(vertices[1].x, vertices[1].y));
    for (let i = 1; i < vertices.length - 2; i++) {
        let startVertex = vertices[i];
        let endVertex = vertices[i + 1];
        container.addChild(_drawLine(startVertex, endVertex));
        container.addChild(_drawJoint(endVertex.x, endVertex.y));
    }
    container.addChild(_drawSegmentWithRightSquare(vertices[vertices.length - 2], vertices[vertices.length - 1]));
    return container;
}

function _drawSegmentWithBothSquares(startVertex : Vector, endVertex : Vector) : DisplayObject {
    return _drawSegmentWithSquares(startVertex, endVertex, true, true);
}

function _drawSegmentWithLeftSquare(startVertex : Vector, endVertex : Vector) : DisplayObject {
    return _drawSegmentWithSquares(startVertex, endVertex, true, false);
}

function _drawSegmentWithRightSquare(startVertex : Vector, endVertex : Vector) : DisplayObject {
    return _drawSegmentWithSquares(startVertex, endVertex, false, true);
}

function _drawSegmentWithSquares(startVertex : Vector, endVertex : Vector, leftSquare : boolean, rightSquare : boolean) : DisplayObject {
    let container = new Container();
    let rotatedEndVertex = vectorRotate(endVertex, -_pathTheta(startVertex, endVertex), startVertex);
    
    if (leftSquare) {
        container.addChild(_drawSquare(startVertex.x, startVertex.y, STARTING_SQUARE_COLOR));
    }
    container.addChild(_drawLine(
        {x: startVertex.x + (leftSquare ? PATH_HEIGHT / 2 : 0), y: startVertex.y}, 
        {x: rotatedEndVertex.x - (rightSquare ? PATH_HEIGHT / 2 : 0), y: rotatedEndVertex.y}
    ));
    if (rightSquare) {
        container.addChild(_drawSquare(rotatedEndVertex.x, rotatedEndVertex.y, ENDING_SQUARE_COLOR));
    }
    
    return _rotateSegemnt(container, _pathTheta(startVertex, endVertex), startVertex);
}

function _rotateSegemnt(drawnSegment : Container, theta : number, rotateAround : Vector) : Container {
    drawnSegment.rotation = theta;
    drawnSegment.pivot.x = rotateAround.x;
    drawnSegment.pivot.y = rotateAround.y;
    drawnSegment.x = rotateAround.x;
    drawnSegment.y = rotateAround.y;
    return drawnSegment;
}

function _pathTheta(startVertex : Vector, endVertex : Vector) : number {
    return Math.atan2(endVertex.y - startVertex.y, endVertex.x - startVertex.x);
}

function _drawLine(startVertex : Vector, endVertex : Vector) : DisplayObject {
    let graphics = new Graphics();
    graphics.lineStyle(4, PATH_COLOR);
    graphics.moveTo(startVertex.x, startVertex.y);
    graphics.lineTo(endVertex.x, endVertex.y);
    return graphics;
}

function _drawSquare(x : number, y : number, color : number = PATH_COLOR) : DisplayObject {
    let graphics = new Graphics();
    graphics.beginFill(color);
    graphics.drawRect(x - PATH_HEIGHT / 2, y - PATH_HEIGHT / 2, PATH_HEIGHT, PATH_HEIGHT);
    graphics.endFill();
    return graphics;
}

function _drawRightTriangle(x : number, y : number, color : number = PATH_COLOR) : DisplayObject {
    let graphics = new Graphics();
    graphics.beginFill(color);
    graphics.moveTo(x, y - (PATH_HEIGHT / 2));
    graphics.lineTo(x + (PATH_HEIGHT / 2), y);
    graphics.lineTo(x, y + (PATH_HEIGHT / 2));
    graphics.lineTo(x, y - (PATH_HEIGHT / 2));
    graphics.endFill();
    return graphics;
}

function _drawJoint(x : number, y: number) : DisplayObject {
    let graphics = new Graphics();
    graphics.beginFill(PATH_COLOR);
    graphics.drawCircle(x, y, PATH_HEIGHT / 4);
    graphics.endFill();
    return graphics;
}

function _drawFirstLoopJoint(x : number, y: number) : DisplayObject {
    let container = new Container();
    container.addChild(_drawSquare(x, y, STARTING_SQUARE_COLOR));
    container.addChild(_drawRightTriangle(x, y, PATH_COLOR));
    return container;
}