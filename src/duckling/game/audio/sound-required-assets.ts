import {Entity} from '../../entitysystem/entity';
import {Asset, AssetMap} from '../../project';

import {getSoundAttribute} from './sound-attribute';

export function entityRequiredSoundAssets(entity : Entity) : AssetMap {
    let soundAttribute = getSoundAttribute(entity);

    let assets : AssetMap = {};
    for (let sound of soundAttribute.sounds) {
        if (!sound.soundKey) {
            continue;
        }

        assets[sound.soundKey] = {
            type: "SoundWAV",
            key: sound.soundKey
        }
    }
    return assets;
}