module util.serialize {
    var ignoreSymbol = Symbol("IgnoreWhenSerializing");
    var keySymbol = Symbol("JsonKey");
    var classProvidedSymbol = Symbol("ClassProvider");
    var classTypenameSymbol = Symbol("ClassTypeName");

    /**
     * Decorator used to describe a class that provides an implementation of
     * a super class.
     * @param baseClass The class that defines the interface.
     * @param name The name of the provided implementation.
     */
    export function ProvideClass(baseClass,name) {
        return function(classObject) {
            if(!baseClass[classProvidedSymbol]) {
                baseClass[classProvidedSymbol] = {};
            }
            baseClass[classProvidedSymbol][name] = classObject;
            classObject[classTypenameSymbol] = name;
            return classObject;
        }
    }

    /**
     * Decorator that signifies the property should be ignored in the serialization process.
     */
    export function Ignore(object : any, propertyKey : string | symbol) {
        if (!object[ignoreSymbol]) {
            object[ignoreSymbol] = {};
        }
        object[ignoreSymbol][propertyKey] = true;
    }

    /**
     * Decorator that can be used to change the JsonKey of a property.
     * @param key String key that will be used in the resulting json.
     */
    export function Key(key : string) {
        return function(object : any, propertyKey : string | symbol) {
            if (!object[keySymbol]) {
                object[keySymbol] = {};
            }
            object[keySymbol][propertyKey] = key;
        }
    }

    export function shouldIgnore(object : Object, key : string) {
        return object[ignoreSymbol] && object[ignoreSymbol][key];
    }

    export function isKeyOverriden(object : Object, key : string) {
        return object[keySymbol] && (key in object[keySymbol]);
    }

    export function getKeyOverride(object : Object, key : string) {
        return object[keySymbol][key];
    }

    export function copySymbols(source : Object, destination : Object) {
        if (source[ignoreSymbol]) {
            destination[ignoreSymbol] = source[ignoreSymbol];
        }
    }

    export function getClass(providedClass : Object, typeName : string) {
        if (!providedClass[classProvidedSymbol]) {
            return null;
        }
        return providedClass[classProvidedSymbol][typeName] || null;
    }

    export function getTypeName(classInstance : Object) {
        if (!classInstance.constructor[classTypenameSymbol]) {
            return null;
        }
        return classInstance.constructor[classTypenameSymbol] || null;
    }
}
