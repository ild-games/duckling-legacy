import { Attribute, Entity } from "../../entitysystem/entity";
import { Music } from "./music";

export const MUSIC_KEY = "music";

export interface MusicAttribute extends Attribute {
  musics: Music[];
}

export let defaultMusic: MusicAttribute = {
  musics: []
};

export function getMusicAttribute(entity: Entity): MusicAttribute {
  return <MusicAttribute>entity[MUSIC_KEY];
}
