import {Entity, Attribute} from '../../entitysystem/entity';

export const ACTION_KEY = "action";

export interface ActionAttribute extends Attribute {
    actions: Actions;
}

export interface Actions {
    platformVelocityActions: Array<any>;
    platformPositionActions: Array<any>;
    affectedByGravity: boolean
}

export let defaultAction : ActionAttribute = {
    actions: {
        platformVelocityActions: [],
        platformPositionActions: [],
        affectedByGravity: true
    }
}

export function getAction(entity : Entity) : ActionAttribute {
    return <ActionAttribute>entity[ACTION_KEY];
}
