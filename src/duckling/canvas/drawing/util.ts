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
 * [drawOval description]
 * @param  {Vector} centerPosition [description]
 * @param  {number} xRadius        [description]
 * @param  {number} yRadius        [description]
 */
export function drawEllipse(centerPosition : Vector, xRadius : number, yRadius : number, graphics : Graphics) {
    graphics.drawEllipse(
        centerPosition.x,
        centerPosition.y,
        xRadius,
        yRadius
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
 * @param  centerPosition Center point of the grid
 * @param  gridDimension  Dimensions of the entire grid
 * @param  cellDimension  Dimensions of a cell
 * @param  graphics       Graphics object used to draw
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

/**
 * Draws the background to a canvas
 * @param  centerPosition  Center point of the background
 * @param  stageDimensions Dimensions of the stage on the canvas
 * @param  graphics        Graphics object used to draw
 */
export function drawCanvasBackground(centerPosition : Vector, stageDimensions : Vector, graphics : Graphics) {
    graphics.beginFill(0xFFFFFF, 1);
    drawRectangle(
        centerPosition,
        stageDimensions,
        graphics);
    graphics.endFill();
}

/**
 * Draws the border to a canvas
 * @param  centerPosition  Center point of the border
 * @param  stageDimensions Dimensions of the stage on the canvas
 * @param  graphics        Graphics object used to draw
 */
export function drawCanvasBorder(centerPosition : Vector, stageDimensions : Vector, graphics : Graphics) {
    graphics.lineColor = 0xAAAAAA;
    drawRectangle(
        centerPosition,
        stageDimensions,
        graphics);
}
