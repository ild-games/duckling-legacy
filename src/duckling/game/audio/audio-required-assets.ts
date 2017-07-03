import {Entity} from '../../entitysystem/entity';
import {Asset, AssetMap} from '../../project';

import {getAudioAttribute} from './audio-attribute';

export function entityRequiredAudioAssets(entity : Entity) : AssetMap {
    let audioAttribute = getAudioAttribute(entity);

    let assets : AssetMap = {};
    for (let sound of audioAttribute.sounds) {
        assets[sound.soundKey] = {
            type: "SoundWAV",
            key: sound.soundKey
        }
    }
    return assets;
}