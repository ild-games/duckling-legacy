import {Entity, Attribute} from '../../entitysystem/entity';

export const TRIGGER_DEATH_KEY = "trigger-death";

export interface TriggerDeathAttribute extends Attribute {
    animationToWatch: string
}

export let defaultTriggerDeath : TriggerDeathAttribute = {
    animationToWatch: ""
}

export function getTriggerDeath(entity : Entity) : TriggerDeathAttribute {
    return entity[TRIGGER_DEATH_KEY] as TriggerDeathAttribute;
}