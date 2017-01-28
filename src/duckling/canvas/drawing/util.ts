import {Graphics, Sprite} from 'pixi.js';

import {Vector} from '../../math/vector';
import {AssetService} from '../../project/asset.service';


/**
 * Draw a rectangle at the given position
 * @param position  Top left of the rectangle
 * @param dimension Dimensions of the rectangle
 * @param graphics  Graphics object used to draw
 */
export function drawRectangle(position : Vector, dimension : Vector, graphics : Graphics) {
    graphics.drawRect(
        position.x,
        position.y,
        dimension.x,
        dimension.y
    );
}

/**
 * Draw an ellipse centered at the given position
 * @param position Top left corner of the ellipse
 * @param xRadius  Radius of the ellipse on the x axis
 * @param yRadius  Radius of the ellipse on the y axis
 * @param graphics Graphics object used to draw.
 */
export function drawEllipse(position : Vector, xRadius : number, yRadius : number, graphics : Graphics) {
    graphics.drawEllipse(
        position.x + xRadius,
        position.y + yRadius,
        xRadius,
        yRadius
    );
}

/**
 * Draw an x at the given position
 * @param position  Center of the x
 * @param dimension Dimensions of the x
 * @param graphics  Graphics object used to draw
 */
export function drawX(position : Vector, dimension : Vector, graphics : Graphics) {
    let halfX = dimension.x / 2;
    let halfY = dimension.y / 2;

    graphics.moveTo(position.x, position.y);
    graphics.lineTo(position.x + dimension.x, position.y + dimension.y);
    
    graphics.moveTo(position.x, position.y + dimension.y);
    graphics.lineTo(position.x + dimension.x, position.y);
}

/**
 * Draws a grid at the given position.
 * @param  centerPosition Center point of the grid
 * @param  gridDimension  Dimensions of the entire grid
 * @param  cellDimension  Dimensions of a cell
 * @param  graphics       Graphics object used to draw
 */
export function drawGrid(centerPosition : Vector, gridDimension : Vector, cellDimension : Vector, graphics : Graphics) {
    let halfX = gridDimension.x / 2;
    let halfY = gridDimension.y / 2;

    let startY = centerPosition.y - halfY + (halfY % cellDimension.y);
    let endY = centerPosition.y + halfY - (halfY % cellDimension.y);
    for (let curY = startY; curY <= endY; curY += cellDimension.y) {
        graphics.moveTo(centerPosition.x - halfX, curY);
        graphics.lineTo(centerPosition.x + halfX, curY);
    }

    let startX = centerPosition.x - halfX + (halfX % cellDimension.x);
    let endX = centerPosition.x + halfX - (halfX % cellDimension.x);
    for (let curX = startX; curX <= endX; curX += cellDimension.x) {
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

/**
 * Draws an image representing a missing asset
 * @param  assetService Instance of the asset service to get the missing image from
 * @return Sprite with the missing images
 */
export function drawMissingAsset(assetService : AssetService) : Sprite {
    let missingTexture = assetService.get("fa-missing-image", "TexturePNG", true);
    let sprite = new Sprite(missingTexture);
    return sprite;
}
