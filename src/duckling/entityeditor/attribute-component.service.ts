import {Component, Injectable} from 'angular2/core';
import {AttributeKey, BaseAttributeService} from '../entitysystem';

/**
 * The AttributeComponentService is used to find and instantiate a component class
 * for an attribute.
 */
@Injectable()
export class AttributeComponentService extends BaseAttributeService<any> {
    /**
     * Get the component class for the attribute.
     * @param  key The key of the attribute the component will be retrieved for.
     * @return The component class to use for the attribute.
     */
    getComponentType(key : AttributeKey) : any {
        return this.getImplementation(key);
    }
}
