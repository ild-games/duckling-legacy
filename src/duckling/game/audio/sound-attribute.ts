import { Attribute, Entity } from "../../entitysystem/entity";
import { Sound } from "./sound";

export const SOUND_KEY = "sound";

export interface SoundAttribute extends Attribute {
  sounds: Sound[];
}

export let defaultSound: SoundAttribute = {
  sounds: []
};

export function getSoundAttribute(entity: Entity): SoundAttribute {
  return <SoundAttribute>entity[SOUND_KEY];
}
