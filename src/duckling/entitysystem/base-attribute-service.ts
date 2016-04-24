import {Attribute, AttributeKey} from './entity';

/**
 * None of the core behavior of duckling should depend on a specific component implementation.
 * If we follow this requirment the game editor can be used for different games with different
 * component implementations. Any service that does need to interact directly with a component
 * should inherit from this base class. Attribute specific implementations should be registered
 * during the duckling bootstrap process. Normally this is kicked off in the main file.
 * @see AttributeComponentService
 * @see AttributeComponent
 * @see AttributeDrawerService
 */
export class BaseAttributeService<ImplementationType> {
    private _attributeComponentType : {[key:string]:ImplementationType} = {};

    /**
     * Register an implementation for an attribute.
     * @param key Key for the attribute the implementation belongs to.
     * @param implementation The implementation that will be used for the attribute.
     */
    register(key : AttributeKey, componentClass : any) : void {
        this._attributeComponentType[key] = componentClass;
    }

    /**
     * Get the implementation for the attribute.
     * @param  key The key of the attribute the implementation will be retrieved for.
     * @return The implementation to use for the attribute.
     */
    getImplementation(key : AttributeKey) : any {
        return this._attributeComponentType[key];
    }


    forEach(callback : (key : AttributeKey, implementation : ImplementationType) => any) {
        for (var key in this._attributeComponentType) {
            callback(key, this._attributeComponentType[key]);
        }
    }
}
