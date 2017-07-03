import {Attribute, Entity} from '../../entitysystem/entity';
import {Sound} from './sound';

export const AUDIO_KEY = "audio";

export interface AudioAttribute extends Attribute {
    sounds: Sound[];
}

export let defaultAudio : AudioAttribute = {
    sounds: []
}