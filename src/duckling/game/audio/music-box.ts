import { AttributeBoundingBox } from "../../entitysystem/services/entity-box.service";
import { Box2 } from "../../math";
import { AssetService } from "../../project";

import { MusicAttribute } from "./music-attribute";
import { getAudioBoundingBox } from "./audio-box";

export const musicBoundingBox: AttributeBoundingBox<any> = {
  getBox(musicAttribute: MusicAttribute, assetService: AssetService): Box2 {
    return getAudioBoundingBox(musicAttribute, assetService);
  }
};
