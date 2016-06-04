import {Graphics} from 'pixi.js';
import {Vector} from '../../math/vector';

/**
 * Draw a rectangle centered at the given position.
 * @param centerPosition Center of the rectangle.
 * @param dimension      Dimensions of the rectangle.
 * @param graphics       Graphics object used to draw.
 */
export function drawRectangle(centerPosition : Vector, dimension : Vector, graphics : Graphics) {
    graphics.drawRect(
        centerPosition.x - dimension.x / 2,
        centerPosition.y - dimension.y / 2,
        dimension.x,
        dimension.y
    );
}

/**
 * Draw an x centered at the given position.
 * @param centerPosition Center of the x.
 * @param dimension      Dimensions of the x.
 * @param graphics       Graphics object used to draw.
 */
export function drawX(centerPosition : Vector, dimension : Vector, graphics : Graphics) {
    var halfX = dimension.x / 2;
    var halfY = dimension.y / 2;

    graphics.moveTo(centerPosition.x - halfX, centerPosition.y - halfY);
    graphics.lineTo(centerPosition.x + halfX, centerPosition.y + halfY);

    graphics.moveTo(centerPosition.x - halfX, centerPosition.y + halfY);
    graphics.lineTo(centerPosition.x + halfX, centerPosition.y - halfY);
}

/**
 * Draws a grid at the given position.
 * @param  {Vector}   centerPosition [description]
 * @param  {Vector}   dimension      [description]
 * @param  {Graphics} graphics       [description]
 * @return {[type]}                  [description]
 */
export function drawGrid(centerPosition : Vector, gridDimension : Vector, cellDimension : Vector, graphics : Graphics) {
    var halfX = gridDimension.x / 2;
    var halfY = gridDimension.y / 2;

    var startY = centerPosition.y - halfY + (halfY % cellDimension.y);
    var endY = centerPosition.y + halfY - (halfY % cellDimension.y);
    for (var curY = startY; curY <= endY; curY += cellDimension.y) {
        graphics.moveTo(centerPosition.x - halfX, curY);
        graphics.lineTo(centerPosition.x + halfX, curY);
    }

    var startX = centerPosition.x - halfX + (halfX % cellDimension.x);
    var endX = centerPosition.x + halfX - (halfX % cellDimension.x);
    for (var curX = startX; curX <= endX; curX += cellDimension.x) {
        graphics.moveTo(curX, centerPosition.y - halfY);
        graphics.lineTo(curX, centerPosition.y + halfY);
    }
}
