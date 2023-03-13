import { Attribute, Entity } from "../../entitysystem/entity";
import { Sound } from "./sound";

export const AUTO_START_MUSIC_KEY = "autoStartMusic";

export interface AutoStartMusicAttribute extends Attribute {
    musicKeyToPlay: string;
}

export let defaultAutoStartMusic: AutoStartMusicAttribute = {
    musicKeyToPlay: "",
};

export function getAutoStartMusic(entity: Entity): AutoStartMusicAttribute {
    return <AutoStartMusicAttribute>entity[AUTO_START_MUSIC_KEY];
}
