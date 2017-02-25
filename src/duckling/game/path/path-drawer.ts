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
        return _drawSegmentWithBothSquares(pathAttribute.vertices[0], pathAttribute.vertices[1]);
    }
    
    if (pathAttribute.isLoop) {
        return _drawLoopPath(pathAttribute.vertices);
    } 
    return _drawPath(pathAttribute.vertices);
}

function _drawLoopPath(vertices : Vector[]) : DisplayObject {
    let container = new Container();
    for (let i = 1; i < vertices.length - 1; i++) {
        let startVertex = vertices[i];
        let endVertex = vertices[i + 1];
        container.addChild(_drawLine(startVertex, endVertex));
        container.addChild(_drawJoint(endVertex));
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
    container.addChild(_drawJoint(rotatedEndVertex));
    container.addChild(_drawSquare(startVertex, STARTING_SQUARE_COLOR));
    
    let loopDirectionPosition = { x: startVertex.x + DIRECTION_INDICATOR_OFFSET, 
                                  y: startVertex.y };
    container.addChild(_drawRightTriangle(loopDirectionPosition, STARTING_SQUARE_COLOR));

    return _rotateSegemnt(container, _pathTheta(startVertex, endVertex), startVertex);
}

function _drawPath(vertices : Vector[]) : DisplayObject {
    let container = new Container();
    container.addChild(_drawSegmentWithLeftSquare(vertices[0], vertices[1]));
    container.addChild(_drawJoint(vertices[1]));
    for (let i = 1; i < vertices.length - 2; i++) {
        let startVertex = vertices[i];
        let endVertex = vertices[i + 1];
        container.addChild(_drawLine(startVertex, endVertex));
        container.addChild(_drawJoint(endVertex));
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
    
    container.addChild(_drawLine(
        {x: startVertex.x, y: startVertex.y}, 
        {x: rotatedEndVertex.x , y: rotatedEndVertex.y}
    ));

    if (leftSquare) {
        container.addChild(_drawSquare(startVertex, STARTING_SQUARE_COLOR));
    }
    
    if (rightSquare) {
        container.addChild(_drawSquare(rotatedEndVertex, ENDING_SQUARE_COLOR));
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
    graphics.lineStyle(PATH_HEIGHT, PATH_COLOR);
    graphics.moveTo(startVertex.x, startVertex.y);
    graphics.lineTo(endVertex.x, endVertex.y);
    return graphics;
}

function _drawSquare(position : Vector, color : number = PATH_COLOR) : DisplayObject {
    let graphics = new Graphics();
    graphics.beginFill(color);
    graphics.drawRect(position.x - (VERTEX_MARKER_HEIGHT / 2), position.y - (VERTEX_MARKER_HEIGHT / 2), VERTEX_MARKER_HEIGHT, VERTEX_MARKER_HEIGHT);
    graphics.endFill();
    return graphics;
}

function _drawRightTriangle(position : Vector, color : number = PATH_COLOR) : DisplayObject {
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
    container.addChild(_drawRightTriangle(position, STARTING_SQUARE_COLOR));
    return container;
}