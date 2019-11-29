import { AttributeBoundingBox } from "../../entitysystem/services/entity-box.service";
import { Box2 } from "../../math";
import { AssetService } from "../../project";

import { SoundAttribute } from "./sound-attribute";
import { getAudioBoundingBox } from "./audio-box";

export const soundBoundingBox: AttributeBoundingBox<any> = {
    getBox(soundAttribute: SoundAttribute, assetService: AssetService): Box2 {
        return getAudioBoundingBox(soundAttribute, assetService);
    },
};
