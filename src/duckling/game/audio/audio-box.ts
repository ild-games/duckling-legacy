import { Entity, Attribute } from "../../entitysystem/entity";
import { Box2, Vector } from "../../math";
import { AssetService } from "../../project";
import { AttributeBoundingBox } from "../../entitysystem/services/entity-box.service";

export function getAudioBoundingBox(
    attribute: Attribute,
    assetService: AssetService
): Box2 {
    let texture = assetService.get(
        { key: "fa-music", type: "TexturePNG" },
        true
    );
    return {
        position: { x: 0, y: 0 },
        dimension: {
            x: texture.frame.width,
            y: texture.frame.height,
        },
        rotation: 0,
    };
}
