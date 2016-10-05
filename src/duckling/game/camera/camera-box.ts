import {Entity} from '../../entitysystem/entity';
import {getPosition} from '../position/position-attribute';
import {Box2, Vector} from '../../math';
import {AssetService} from '../../project';

/**
 * Get the bounding box for an entity with a camera attribute.
 * @param entity The entity the bounding box will be built for.
 * @return A Box2 bounding box for the entity's camera attribute.
 */
export function cameraBoundingBox(entity : Entity, assetService : AssetService) : Box2 {
    let positionAttribute = getPosition(entity);
    let position : Vector = {x: 0, y: 0};
    if (positionAttribute) {
        position = positionAttribute.position;
    }

    let cameraTexture = assetService.get("fa-video-camera", true);
    return {
        position: position,
        dimension: {
            x: cameraTexture.frame.width,
            y: cameraTexture.frame.height
        },
        rotation: 0
    }
}
