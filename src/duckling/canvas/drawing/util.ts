import { Graphics, Sprite, DisplayObject } from "pixi.js";

import { Vector } from "../../math/vector";
import { AssetService } from "../../project/asset.service";

import { DrawnConstruct } from "./drawn-construct";

/**
 * Draw a rectangle at the given position
 * @param position  Top left of the rectangle
 * @param dimension Dimensions of the rectangle
 * @param graphics  Graphics object used to draw
 */
export function drawRectangle(
  position: Vector,
  dimension: Vector,
  graphics: Graphics
) {
  graphics.drawRect(position.x, position.y, dimension.x, dimension.y);
}

/**
 * Draw an ellipse centered at the given position
 * @param position Top left corner of the ellipse
 * @param xRadius  Radius of the ellipse on the x axis
 * @param yRadius  Radius of the ellipse on the y axis
 * @param graphics Graphics object used to draw.
 */
export function drawEllipse(
  position: Vector,
  xRadius: number,
  yRadius: number,
  graphics: Graphics
) {
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
export function drawX(position: Vector, dimension: Vector, graphics: Graphics) {
  let halfX = dimension.x / 2;
  let halfY = dimension.y / 2;

  graphics.moveTo(position.x, position.y);
  graphics.lineTo(position.x + dimension.x, position.y + dimension.y);

  graphics.moveTo(position.x, position.y + dimension.y);
  graphics.lineTo(position.x + dimension.x, position.y);
}

/**
 * Draws a grid at the given position.
 * @param  position Top left position of the grid
 * @param  gridDimension  Dimensions of the entire grid
 * @param  cellDimension  Dimensions of a cell
 * @param  graphics       Graphics object used to draw
 */
export function drawGrid(
  position: Vector,
  gridDimension: Vector,
  cellDimension: Vector,
  graphics: Graphics
) {
  let endX = gridDimension.x;
  let endY = gridDimension.y;

  for (let curY = 0; curY <= endY; curY += cellDimension.y) {
    graphics.moveTo(0, curY);
    graphics.lineTo(endX, curY);
  }

  for (let curX = 0; curX <= endX; curX += cellDimension.x) {
    graphics.moveTo(curX, 0);
    graphics.lineTo(curX, endY);
  }
}

/**
 * Draws the background to a canvas
 * @param  centerPosition  Center point of the background
 * @param  stageDimensions Dimensions of the stage on the canvas
 * @param  graphics        Graphics object used to draw
 */
export function drawCanvasBackground(
  centerPosition: Vector,
  stageDimensions: Vector,
  graphics: Graphics
) {
  graphics.beginFill(0xffffff, 1);
  drawRectangle(centerPosition, stageDimensions, graphics);
  graphics.endFill();
}

/**
 * Draws the border to a canvas
 * @param  centerPosition  Center point of the border
 * @param  stageDimensions Dimensions of the stage on the canvas
 * @param  graphics        Graphics object used to draw
 */
export function drawCanvasBorder(
  centerPosition: Vector,
  stageDimensions: Vector,
  graphics: Graphics
) {
  graphics.lineColor = 0xaaaaaa;
  drawRectangle(centerPosition, stageDimensions, graphics);
}

class MissingDrawnConstruct extends DrawnConstruct {
  private _sprite: Sprite;

  constructor(private _missingTexture: any) {
    super();
    this._sprite = new Sprite(this._missingTexture);
  }

  draw(totalMillis: number): DisplayObject {
    return this._sprite;
  }
}

/**
 * Draws an image representing a missing asset
 * @param  assetService Instance of the asset service to get the missing image from
 * @return Sprite with the missing images
 */
export function drawMissingAsset(assetService: AssetService): DrawnConstruct {
  let missingTexture = assetService.get(
    { key: "fa-missing-image", type: "TexturePNG" },
    true
  );

  let drawnConstruct = new MissingDrawnConstruct(missingTexture);
  drawnConstruct.layer = Number.POSITIVE_INFINITY;
  return drawnConstruct;
}
