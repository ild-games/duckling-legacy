import {Entity} from '../../entitysystem/entity';
import {Box2, Vector} from '../../math';
import {AssetService} from '../../project';

/**
 * Get the bounding box for an entity with a camera attribute.
 * @param entity The entity the bounding box will be built for.
 * @return A Box2 bounding box for the entity's camera attribute.
 */
export function cameraBoundingBox(entity : Entity, assetService : AssetService) : Box2 {
    let cameraTexture = assetService.get({key: "fa-video-camera", type: "TexturePNG"}, true);
    return {
        position: {x: 0, y: 0},
        dimension: {
            x: cameraTexture.frame.width,
            y: cameraTexture.frame.height
        },
        rotation: 0
    }
}
