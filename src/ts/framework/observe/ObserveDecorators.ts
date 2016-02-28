import SimpleObservable from './SimpleObservable';
import DataChangeCallback from './DataChangeCallback';
import DataChangeEvent from './DataChangeEvent';

var backingProperties = Symbol("BackingProperties");

interface Property {
    value : any | SimpleObservable;
    callback : DataChangeCallback<DataChangeEvent>;
}

function getBackingProperties(object) : { [key:string] : any } {
    var backing = object[backingProperties];
    if (!backing) {
        backing = {};
        object[backingProperties] = backing;
    }
    return backing;
}

function getBackingProperty(object : SimpleObservable, key) {
    var backing = getBackingProperties(object);
    var property : Property = backing[key];
    if (!property) {
        property = { value : null, callback : function (event) {
            object.dataChanged(key, null, event);
        }};
        backing[key] = property;
    }
    return property;
}

/**
 * Decorates a primitive property on an observable object.  Used to signify changing the primitive should
 * generate an event.
 * @param typeFunction Function that can be used to convert the set value into the stored value.
 */
export function ObservePrimitive(typeFunction? : Function) {
    return function(classObject : any, propertyKey : string) {
        var descriptor = {
            enumerable: true,
            get: function () {
                return getBackingProperties(this)[propertyKey];
            },
            set: function (newValue) {
                (<any>Object).getNotifier(this).performChange('update', function() {
                    return {name: propertyKey};
                });
                if (typeFunction) {
                    getBackingProperties(this)[propertyKey] = typeFunction(newValue);
                } else {
                    getBackingProperties(this)[propertyKey] = newValue;
                }
                this.dataChanged(propertyKey);
            }
        };
        Object.defineProperty(classObject, propertyKey, descriptor);
    }
}

/**
 * Decorates an object property on an observable object.  Used to signify changing the object should generate
 * an event.
 */
export function ObserveObject() {
    return function(classObject : any, propertyKey : string) {
        var descriptor = {
            enumerable : true,
            get : function () {
                return getBackingProperty(this, propertyKey).value;
            },
            set : function(newValue : SimpleObservable) {
                (<any>Object).getNotifier(this).performChange('update', function() {
                    return {name: propertyKey};
                });
                var property = getBackingProperty(this, propertyKey);
                var oldValue = property.value;

                if (oldValue) {
                    oldValue.removeChangeListener(property.callback);
                }

                property.value = newValue;

                if (newValue) {
                    newValue.addChangeListener(property.callback);
                }

                this.dataChanged(propertyKey);
            }
        };
        Object.defineProperty(classObject, propertyKey, descriptor);
    }
}
