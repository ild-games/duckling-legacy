import { Sprite, Point, DisplayObject, Texture } from "pixi.js";

import {
    DrawnConstruct,
    TransformProperties,
} from "../../canvas/drawing/drawn-construct";
import { Entity } from "../../entitysystem/entity";
import { AssetService } from "../../project/asset.service";
import { AttributeDrawer } from "../../canvas/drawing/entity-drawer.service";
import { Vector } from "../../math/vector";

import { CameraAttribute } from "./camera-attribute";

class CameraDrawnConstruct extends DrawnConstruct {
    private _sprite: Sprite;

    constructor(private _cameraTexture: Texture, private _position: Vector) {
        super();

        this._sprite = new Sprite(this._cameraTexture);
        this._sprite.position = this._position as Point;
    }

    draw(totalMillis: number): DisplayObject {
        return this._sprite;
    }
}

export function getCameraAttributeDrawnConstruct(
    cameraAttribute: CameraAttribute,
    assetService: AssetService,
    position: Vector
): DrawnConstruct {
    let cameraTexture = assetService.get(
        { key: "fa-video-camera", type: "TexturePNG" },
        true
    );

    let drawnConstruct = new CameraDrawnConstruct(cameraTexture, position);
    drawnConstruct.layer = Number.POSITIVE_INFINITY;
    return drawnConstruct;
}
