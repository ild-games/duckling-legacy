import {Graphics, DisplayObject, Container} from 'pixi.js';

import {DrawnConstruct} from '../../canvas/drawing';
import {Entity} from '../../entitysystem/entity';
import {drawRectangle} from '../../canvas/drawing/util';
import {Vector, vectorRotate} from '../../math/vector';

import {getPath} from './path-attribute';

export const PATH_HEIGHT = 20;
const PATH_COLOR = 0x000000;

export function drawPathAttribute(entity : Entity) : DrawnConstruct {
    let pathAttribute = getPath(entity);
    if (!pathAttribute || pathAttribute.vertices.length === 0) {
        return null;
    }

    if (pathAttribute.vertices.length === 1) {
        return _drawJoint(0, 0);
    }
    
    if (pathAttribute.vertices.length === 2) {
        return _drawSegmentWithBothArrows(pathAttribute.vertices[0], pathAttribute.vertices[1]);
    }
    
    return _drawPath(pathAttribute.vertices);
}

function _drawPath(vertices : Vector[]) : DrawnConstruct {
    let container = new Container();
    container.addChild(_drawSegmentWithLeftArrow(vertices[0], vertices[1]));
    container.addChild(_drawJoint(vertices[1].x, vertices[1].y));
    for (let i = 1; i < vertices.length - 2; i++) {
        let startVertex = vertices[i];
        let endVertex = vertices[i + 1];
        container.addChild(_drawLine(startVertex, endVertex));
        container.addChild(_drawJoint(endVertex.x, endVertex.y));
    }
    container.addChild(_drawSegmentWithRightArrow(vertices[vertices.length - 2], vertices[vertices.length - 1]));
    return container;
}

function _drawSegmentWithBothArrows(startVertex : Vector, endVertex : Vector) : DisplayObject {
    return _drawSegmentWithArrows(startVertex, endVertex, true, true);
}

function _drawSegmentWithLeftArrow(startVertex : Vector, endVertex : Vector) : DisplayObject {
    return _drawSegmentWithArrows(startVertex, endVertex, true, false);
}

function _drawSegmentWithRightArrow(startVertex : Vector, endVertex : Vector) : DisplayObject {
    return _drawSegmentWithArrows(startVertex, endVertex, false, true);
}

function _drawSegmentWithArrows(startVertex : Vector, endVertex : Vector, leftArrow : boolean, rightArrow : boolean) : DisplayObject {
    let container = new Container();
    let rotatedEndVertex = vectorRotate(endVertex, -_pathTheta(startVertex, endVertex), startVertex);
    
    if (leftArrow) {
        container.addChild(_drawLeftTriangle(startVertex.x, startVertex.y));
    }
    container.addChild(_drawLine(
        {x: startVertex.x + (leftArrow ? PATH_HEIGHT / 2 : 0), y: startVertex.y}, 
        {x: rotatedEndVertex.x - (rightArrow ? PATH_HEIGHT / 2 : 0), y: rotatedEndVertex.y}
    ));
    if (rightArrow) {
        container.addChild(_drawRightTriangle(rotatedEndVertex.x - (PATH_HEIGHT / 2), rotatedEndVertex.y));
    }
    
    return _rotateArrowSegemnt(container, _pathTheta(startVertex, endVertex), startVertex);
}

function _rotateArrowSegemnt(drawnSegment : Container, theta : number, rotateAround : Vector) : Container {
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
    graphics.lineStyle(PATH_HEIGHT / 3, PATH_COLOR);
    graphics.moveTo(startVertex.x, startVertex.y);
    graphics.lineTo(endVertex.x, endVertex.y);
    return graphics;
}

function _drawLeftTriangle(x : number, y : number) : DisplayObject {
    let graphics = new Graphics();
    graphics.beginFill(PATH_COLOR);
    graphics.moveTo(x, y);
    graphics.lineTo(x + PATH_HEIGHT / 2, y - (PATH_HEIGHT / 2));
    graphics.lineTo(x + PATH_HEIGHT / 2, y + (PATH_HEIGHT / 2));
    graphics.lineTo(x, y);
    graphics.endFill();
    return graphics;
}

function _drawRightTriangle(x : number, y : number) : DisplayObject {
    let graphics = new Graphics();
    graphics.beginFill(PATH_COLOR);
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
    graphics.drawCircle(x, y, PATH_HEIGHT / 2);
    graphics.endFill();
    return graphics;
}