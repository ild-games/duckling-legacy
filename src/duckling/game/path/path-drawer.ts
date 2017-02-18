import {Graphics, DisplayObject, Container} from 'pixi.js';

import {DrawnConstruct} from '../../canvas/drawing';
import {Entity} from '../../entitysystem/entity';
import {drawRectangle} from '../../canvas/drawing/util';
import {Vector, vectorRotate} from '../../math/vector';

import {getPath} from './path-attribute';

export const PATH_HEIGHT = 25;
const PATH_COLOR = 0x000000;

export function drawPathAttribute(entity : Entity) : DrawnConstruct {
    let pathAttribute = getPath(entity);
    if (!pathAttribute) {
        return null;
    }

    let container = new Container();
    let theta = _pathTheta(pathAttribute.startVertex, pathAttribute.endVertex);
    let rotatedEnd = vectorRotate(pathAttribute.endVertex, -theta, pathAttribute.startVertex);
    
    container.addChild(_drawLeftTriangle(pathAttribute.startVertex.x, pathAttribute.startVertex.y));
    container.addChild(_drawLine(pathAttribute.startVertex, rotatedEnd));
    container.addChild(_drawRightTriangle(rotatedEnd.x - (PATH_HEIGHT / 2), rotatedEnd.y));
    
    container.rotation = theta;
    container.pivot.x = pathAttribute.startVertex.x;
    container.pivot.y = pathAttribute.startVertex.y;
    container.x = pathAttribute.startVertex.x;
    container.y = pathAttribute.startVertex.y;
    return container;
}

function _pathTheta(startVertex : Vector, endVertex : Vector) : number {
    return Math.atan2(endVertex.y - startVertex.y, endVertex.x - startVertex.x);
}

function _drawLine(startVertex : Vector, endVertex : Vector) : DisplayObject {
    let graphics = new Graphics();
    graphics.lineStyle(PATH_HEIGHT / 3, PATH_COLOR);
    graphics.moveTo(startVertex.x + (PATH_HEIGHT / 2), startVertex.y);
    graphics.lineTo(endVertex.x - (PATH_HEIGHT / 2), endVertex.y);
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