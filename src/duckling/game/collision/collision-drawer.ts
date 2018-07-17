import { Graphics } from "pixi.js";

import { drawRectangle, drawX } from "../../canvas/drawing/util";
import {
  DrawnConstruct,
  TransformProperties
} from "../../canvas/drawing/drawn-construct";
import { Entity } from "../../entitysystem/entity";
import { AssetService } from "../../project";
import { Vector } from "../../math/vector";
import { AttributeDrawer } from "../../canvas/drawing/entity-drawer.service";

import { CollisionAttribute } from "./collision-attribute";

const blue = 0x00ccff;

class CollisionDrawnConstruct extends DrawnConstruct {
  constructor(
    private _dimension: Vector,
    private _anchor: Vector,
    private _position: Vector
  ) {
    super();
  }

  paint(graphics: Graphics) {
    graphics.lineStyle(1, blue, 1);
    drawRectangle(
      {
        x: this._position.x - this._dimension.x * this._anchor.x,
        y: this._position.y - this._dimension.y * this._anchor.y
      },
      this._dimension,
      graphics
    );
    drawX(
      {
        x: this._position.x - this._dimension.x * this._anchor.x,
        y: this._position.y - this._dimension.y * this._anchor.y
      },
      this._dimension,
      graphics
    );
  }
}

export function getCollisionAttributeDrawnConstruct(
  collisionAttribute: CollisionAttribute,
  assetService: AssetService,
  position: Vector
): DrawnConstruct {
  let drawnConstruct = new CollisionDrawnConstruct(
    collisionAttribute.dimension.dimension,
    collisionAttribute.anchor,
    position
  );
  drawnConstruct.layer = Number.POSITIVE_INFINITY;
  return drawnConstruct;
}
