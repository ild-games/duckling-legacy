import {Sprite, Point} from 'pixi.js';

import {DrawnConstruct, TransformProperties} from '../../canvas/drawing/drawn-construct';
import {Entity} from '../../entitysystem/entity';
import {AssetService} from '../../project/asset.service';
import {AttributeDrawer} from '../../canvas/drawing/entity-drawer.service';

import {CameraAttribute} from './camera-attribute';

export function getCameraAttributeDrawnConstruct(cameraAttribute : CameraAttribute, assetService : AssetService) : DrawnConstruct {
    let cameraTexture = assetService.get({key: "fa-video-camera", type: "TexturePNG"}, true);

    let drawnConstruct = new DrawnConstruct();
    drawnConstruct.layer = Number.POSITIVE_INFINITY;
    drawnConstruct.drawable = (totalMillis : number, transformProperties : TransformProperties) => {
        let sprite = new Sprite(cameraTexture);
        sprite.position = transformProperties.position as Point;
        return sprite;
    }
    return drawnConstruct;
}
