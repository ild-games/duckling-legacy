import { AssetService } from '../../project/asset.service';

import { DrawnConstruct } from '../../canvas/drawing/drawn-construct';
import { SoundAttribute } from "./sound-attribute";
import { getAudioAttributeDrawnConstruct } from "./audio-drawer";
import { Vector } from '../../math/vector';

export function getSoundAttributeDrawnConstruct(soundAttribute : SoundAttribute, assetService : AssetService, position : Vector) : DrawnConstruct {
    return getAudioAttributeDrawnConstruct(soundAttribute, assetService, position);
}
