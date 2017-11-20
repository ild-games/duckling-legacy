import {Map} from 'immutable';

import {toTitleCase, isAllCaps} from '../util/string';

export type Attribute = Object;
export type AttributeKey = string;
export type Entity = {[key:string]:Attribute};
export type EntityKey = string;

export type EntitySystem = Map<EntityKey,Entity>;

export function createEntitySystem() : EntitySystem {
    return Map<EntityKey,Entity>();
}

export interface TaggedAttribute {
    key : AttributeKey,
    attribute : Attribute
}

export interface TaggedEntity {
    key : EntityKey,
    entity : Entity
}

export function attributeDisplayName(attributeKey : AttributeKey) : string {
    function _isNextWordInAttributeName(curChar : string, lastChar : string) : boolean {
        return (
            curChar === curChar.toUpperCase() &&
            lastChar === lastChar.toLowerCase()
        );
    }

    let words : string[] = [];
    let startOfNextWord = 0;
    let lastChar = "";
    for (let i = 0; i < attributeKey.length; i++) {
        let char = attributeKey.charAt(i);
        if (_isNextWordInAttributeName(char, lastChar)) {
            words.push(attributeKey.substring(startOfNextWord, i));
            startOfNextWord = i;
        }
        lastChar = char;
    }
    words.push(attributeKey.substring(startOfNextWord));

    return words.map((word) => {
        if (isAllCaps(word)) {
            return word;
        }
        return toTitleCase(word);
    }).join(" ");
}

