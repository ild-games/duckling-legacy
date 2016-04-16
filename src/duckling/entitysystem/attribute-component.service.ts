import {Component, Injectable} from 'angular2/core';

import {Attribute, AttributeKey} from './entity';

/**
 * The AttributeComponentService is used to find and instantiate a component class
 * for an attribute.
 */
@Injectable()
export class AttributeComponentService {
    private _attributeComponentType : {[key:string]:any} = {};

    /**
     * Register an attributes component class.
     * @param key Key for the attribute the component is used with.
     * @param componentType The component class that will be used for the attribute.
     */
    register(key : AttributeKey, componentClass : any) : void {
        this._attributeComponentType[key] = componentClass;
    }

    /**
     * Get the component class for the attribute.
     * @param  key The key of the attribute the component will be retrieved for.
     * @return The component class to use for the attribute.
     */
    getComponentType(key : AttributeKey) : any {
        return this._attributeComponentType[key];
    }
}
