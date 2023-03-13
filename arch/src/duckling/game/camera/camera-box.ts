import { Entity } from "../../entitysystem/entity";
import { Box2, Vector } from "../../math";
import { AssetService } from "../../project";
import { AttributeBoundingBox } from "../../entitysystem/services/entity-box.service";
import { CameraAttribute } from "./camera-attribute";
/**
 * Get the bounding box for an entity with a camera attribute.
 * @param entity The entity the bounding box will be built for.
 * @return A Box2 bounding box for the entity's camera attribute.
 */
export const cameraBoundingBox: AttributeBoundingBox<any> = {
    getBox(cameraAttribute: CameraAttribute, assetService: AssetService): Box2 {
        let cameraTexture = assetService.get(
            { key: "fa-video-camera", type: "TexturePNG" },
            true
        );
        return {
            position: { x: 0, y: 0 },
            dimension: {
                x: cameraTexture.frame.width,
                y: cameraTexture.frame.height,
            },
            rotation: 0,
        };
    },
};
