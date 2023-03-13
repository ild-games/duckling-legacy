import { AssetService } from "../../project/asset.service";

import { DrawnConstruct } from "../../canvas/drawing/drawn-construct";
import { MusicAttribute } from "./music-attribute";
import { getAudioAttributeDrawnConstruct } from "./audio-drawer";
import { Vector } from "../../math/vector";

export function getMusicAttributeDrawnConstruct(
    musicAttribute: MusicAttribute,
    assetService: AssetService,
    position: Vector
): DrawnConstruct {
    return getAudioAttributeDrawnConstruct(
        musicAttribute,
        assetService,
        position
    );
}
