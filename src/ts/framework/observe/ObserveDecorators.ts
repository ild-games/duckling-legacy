
module framework.__private {
    export var GlobalObject = Object;
}

module framework.observe {

    var backingProperties = Symbol("BackingProperties");

    function getBackingProperties(object) {
        var backing = object[backingProperties];
        if (!backing) {
            backing = {};
            object[backingProperties] = backing;
        }
        return backing;
    }

    /**
     */
    /**
     * Decorates a primitive property on an observable object.  Used to signify changing the primitive should
     * generate an event.
     * @param typeFunction Function that can be used to convert the set value into the stored value.
     */
    export function Primitive(typeFunction? : Function) {
        return function(classObject : any, propertyKey : string) {
            function getDescriptor() {
                var value;
                return {
                    enumerable: true,
                    get: function () {
                        return getBackingProperties(this)[propertyKey];
                    },
                    set: function (newValue) {
                        if (typeFunction) {
                            getBackingProperties(this)[propertyKey] = typeFunction(newValue);
                        } else {
                            getBackingProperties(this)[propertyKey] = newValue;
                        }
                        this.dataChanged(propertyKey);
                    }
                }
            }

            __private.GlobalObject.defineProperty(
                classObject,
                propertyKey,
                getDescriptor()
            )
        }
    }

    /**
     * Decorates an object property on an observable object.  Used to signify changing the object should generate
     * an event.
     */
    export function Object(classObject : any, propertyKey : string) {
        function getDescriptor() {
            var value;
            return {
                enumerable : true,
                get : function () {
                    return value;
                },
                set : function(newValue) {
                    var backing = getBackingProperties(this);
                    var oldValue = backing[propertyKey];
                    if (oldValue) {
                        oldValue.stopListening(propertyKey, this);
                    }
                    backing[propertyKey] = newValue;
                    value.listenForChanges(propertyKey, this);
                    this.dataChanged(propertyKey);
                }
            }
        }

        __private.GlobalObject.defineProperty(classObject,propertyKey,getDescriptor());
    }
}