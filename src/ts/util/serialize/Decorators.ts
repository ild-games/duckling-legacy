import {getSymbolFromObject, getSymbolMapForClass, copySymbolMap} from '../ClassSymbols';

var ignoreSymbol = Symbol("IgnoreWhenSerializing");
var keySymbol = Symbol("JsonKey");
var classProvidedSymbol = Symbol("ClassProvider");
var classTypenameSymbol = Symbol("ClassTypeName");

var classTypes = {};

/**
* Decorator used to describe a class that provides an implementation of
* a super class.
* @param baseClass The class that defines the interface.
* @param name The name of the provided implementation.
*/
export function ProvideClass(baseClass,name) {
    return function(classObject) {
        getSymbolMapForClass(baseClass,classProvidedSymbol)[name] = classObject;
        classObject[classTypenameSymbol] = name;
        classTypes[name] = classObject;
        return classObject;
    }
}

/**
* Decorator that signifies the property should be ignored in the serialization process.
*/
export function Ignore(classObject : any, propertyKey : string | symbol) {
    getSymbolMapForClass(classObject, ignoreSymbol)[propertyKey] = true;
}

/**
* Decorator that can be used to change the JsonKey of a property.
* @param key String key that will be used in the resulting json.
*/
export function Key(key : string) {
    return function(classObject : any, propertyKey : string | symbol) {
        getSymbolMapForClass(classObject,keySymbol)[propertyKey] = key;
    }
}

/**
* Determine if the key on the object should be ignored during the serialization process.
* @param object Object that is being tested.
* @param key String key that is being checked.
* @returns True if the key should be ignored, false if it should be included in the serialziation process.
*/
export function shouldIgnore(object : Object, key : string) {
    var symbolMap = getSymbolFromObject(object, ignoreSymbol);
    return symbolMap && symbolMap[key];
}

/**
* Returns True if the key has been overridden and another key should be used in its place.
* @param object Object that is being tested.
* @param key Key that is being tested.
* @returns True if the key was overridden, false otherwise.
*/
export function isKeyOverridden(object : Object, key : string) {
    var symbolMap = getSymbolFromObject(object,keySymbol);
    return symbolMap && (key in symbolMap);
}

/**
* Get the key that should be used in place of the provided key during the serialzation process.
* @param object Object that is being tested.
* @param key String key that is overridden on the object..
* @returns The string key that should be used.
*/
export function getKeyOverride(object : Object, key : string) {
    return getSymbolFromObject(object,keySymbol)[key];
}

/**
* Copy the symbols used by the serialization process from one object to the other.
* @param source Object that symbols are being copied from.
* @param destination Object that symbols are being copied to.
*/
export function copySymbols(source : Object, destination : Object) {
    copySymbolMap(source, destination, ignoreSymbol);
}

/**
* Get the Name of the type.  Used to identify polymorphic types during the
* serialization process.
* @param classInstance Instance of the class that a type name is needed for.
* @returns String describing the object's type.  The string is added to the JSON string
*     after serialization.
*/
export function getTypeName(classInstance : Object) {
    if (!classInstance.constructor[classTypenameSymbol]) {
        return null;
    }
    return classInstance.constructor[classTypenameSymbol] || null;
}

/**
* Get the class corresponding to the type name.
* @param typeName String in a serialized object tree that describes a type.
* @returns Constructor for the class described by the type name.  Null if no
*     such class exists.
*/
export function getClassForName(typeName : string) {
    return classTypes[typeName] || null;
}
