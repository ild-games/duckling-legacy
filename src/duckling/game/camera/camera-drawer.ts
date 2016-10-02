import {Sprite} from 'pixi.js';

import {DrawnConstruct} from '../../canvas/drawing';
import {Entity} from '../../entitysystem/entity';
import {AssetService} from '../../project';
import {getPosition} from '../position/position-attribute';

/**
 * Used to draw a camera attribute
 * @param  entity The entity with the camera attribute
 * @return Camera drawable
 */
export function drawCameraAttribute(entity : Entity, assetService : AssetService) : DrawnConstruct {
    let positionAttribute = getPosition(entity);

    let cameraTexture = assetService.get("fa-video-camera", true);
    let sprite = new Sprite(cameraTexture);
    sprite.x = -sprite.width / 2;
    sprite.y = -sprite.height / 2;
    if (positionAttribute) {
        sprite.position.x += positionAttribute.position.x;
        sprite.position.y += positionAttribute.position.y;
    }
    return sprite;
}
