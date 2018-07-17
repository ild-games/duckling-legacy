import { Sprite, Point, DisplayObject, Texture } from "pixi.js";

import {
  DrawnConstruct,
  TransformProperties
} from "../../canvas/drawing/drawn-construct";
import { Entity, Attribute } from "../../entitysystem/entity";
import { AssetService } from "../../project/asset.service";
import { AttributeDrawer } from "../../canvas/drawing/entity-drawer.service";
import { Vector } from "../../math/vector";

class AudioDrawnConstruct extends DrawnConstruct {
  private _sprite: Sprite;

  constructor(private _musicTexture: Texture, private _position: Vector) {
    super();

    this._sprite = new Sprite(this._musicTexture);
    this._sprite.position = this._position as Point;
  }

  draw(totalMillis: number): DisplayObject {
    return this._sprite;
  }
}

export function getAudioAttributeDrawnConstruct(
  attribute: Attribute,
  assetService: AssetService,
  position: Vector
): DrawnConstruct {
  let musicTexture = assetService.get(
    { key: "fa-music", type: "TexturePNG" },
    true
  );

  let drawnConstruct = new AudioDrawnConstruct(musicTexture, position);
  drawnConstruct.layer = Number.POSITIVE_INFINITY;
  return drawnConstruct;
}
