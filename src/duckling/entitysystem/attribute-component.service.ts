import {Component, Injectable} from 'angular2/core';

import {Attribute, AttributeKey} from './entity';

@Injectable()
export class AttributeComponentService {
    private _attributeComponentType : {[key:string]:any} = {};

    register(key : AttributeKey, componentType : any) : void {
        this._attributeComponentType[key] = componentType;
    }

    getComponentType(key : AttributeKey) : any {
        return this._attributeComponentType[key];
    }
}
