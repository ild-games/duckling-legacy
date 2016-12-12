import {Attribute, Entity} from '../../entitysystem/entity';

export const BUTTON_KEY = "button";

/**
 * Gives an entity the behavior of a button.
 */
export interface ButtonAttribute extends Attribute {
    key : string;
}

export let defaultButton : ButtonAttribute = {
    key : ""
};
