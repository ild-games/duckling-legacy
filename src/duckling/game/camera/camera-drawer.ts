import {Sprite, Point, DisplayObject, Texture} from 'pixi.js';

import {DrawnConstruct, TransformProperties} from '../../canvas/drawing/drawn-construct';
import {Entity} from '../../entitysystem/entity';
import {AssetService} from '../../project/asset.service';
import {AttributeDrawer} from '../../canvas/drawing/entity-drawer.service';

import {CameraAttribute} from './camera-attribute';

class CameraDrawnConstruct extends DrawnConstruct {
    cameraTexture : Texture;

    drawable(totalMillis : number) : DisplayObject {
        let sprite = new Sprite(this.cameraTexture);
        sprite.position = this.transformProperties.position as Point;
        return sprite;
    }
}

export function getCameraAttributeDrawnConstruct(cameraAttribute : CameraAttribute, assetService : AssetService) : DrawnConstruct {
    let cameraTexture = assetService.get({key: "fa-video-camera", type: "TexturePNG"}, true);

    let drawnConstruct = new CameraDrawnConstruct();
    drawnConstruct.layer = Number.POSITIVE_INFINITY;
    drawnConstruct.cameraTexture = cameraTexture;
    return drawnConstruct;
}
