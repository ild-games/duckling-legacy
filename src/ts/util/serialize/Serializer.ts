///<reference path="Decorators.ts"/>
module util.serialize {

    const JSON_TYPE_KEY = "__cpp_type";

    /**
     * Function that can be used as a replacer during serialization to respect the JsonKey and
     * Ignore decorators.
     * @param key The key on the object that is being serialized.
     * @param value The object being serialized.
     */
    function replacer(key, value) {
        if (shouldIgnore(this, key)) {
            return undefined;
        }

        if ((typeof value !== "object") || (value === null)) {
            return value;
        }

        if (Array.isArray(value)) {
            return value;
        }

        var replacement = {};
        for (var propKey in value) {
            if (isKeyOverridden(value, propKey)) {
                replacement[getKeyOverride(value, propKey)] = value[propKey];
            } else {
                replacement[propKey] = value[propKey];
            }
        }

        if (getTypeName(value)) {
            replacement[JSON_TYPE_KEY] = getTypeName(value);
        }

        copySymbols(value, replacement);

        return replacement;
    }

    /**
     * Serialize the object into JSON.
     * @param object Object that should be serialized.
     * @returns A JSON string representing the object.
     */
    export function serialize(object : Object) {
        return JSON.stringify(object, replacer, 2);
    }

    /**
     * When JSON is loaded from disk it returns an object tree of plain old javascirpt objects (pojo)
     * (I.E. Not instances of classes). This functions takes the pojo tree created
     * by parsing the JSON and the root instance of a class hierarchy.  It walks down the plain
     * old javascript object and sets the corresponding values on the tree of class instances.
     * It also inspects the pojo tree for type name ("__cpp_type" keys).  When a type name
     * is found an object of the described class is created and values from the pojo tree are set on the
     * new class instance.
     * @param plainObjectTree Tree of plain objects created during the parse process (pojo tree).
     * @param rootResultObject Instance of a class that the pojo tree should be assigned to.
     * @returns The rootResultObject after being initialized with the data in the pojo tree.
     */
    export function buildTypesFromObjects(plainObjectTree, rootResultObject?) {
        var rootTypedObject;
        var typeName = plainObjectTree[JSON_TYPE_KEY];

        if (Array.isArray(plainObjectTree)) {
            rootTypedObject = [];

            plainObjectTree.forEach(function(child) {
                rootTypedObject.push(child)
            });

            return rootTypedObject;
        }

        if (rootResultObject) {
            rootTypedObject = rootResultObject;
        } else if (typeName) {
            rootTypedObject = new (getClassForName(typeName));
        } else {
            rootTypedObject = {};
        }

        for (var key in plainObjectTree) {
            if (key === JSON_TYPE_KEY) {
                continue;
                // Ignore the Key
            }

            var typedValue = rootTypedObject[key];
            var plainValue = plainObjectTree[key];

            if (getCustomSerializer(typedValue)) {
                getCustomSerializer(typedValue).fromJSON(buildTypesFromObjects(plainValue));
            } else if (typeof typedValue === typeof {}) {
                buildTypesFromObjects(plainObjectTree[key], typedValue)
            } else if (typeof plainObjectTree[key] == typeof {}) {
                rootTypedObject[key] = buildTypesFromObjects(plainValue);
            } else {
                rootTypedObject[key] = plainObjectTree[key]
            }
        }

        return rootTypedObject;
    }

    /**
     * Deserialize the JSON string and produce an object representing the data.
     * @param json JSON string representing a tree of objects.
     * @param typedRoot Instance of a class that is used as the root of the resulting tree.
     * @return Object representation of the JSON string or an initialized typeRoot if provided.
     */
    export function deserialize(json : string, typedRoot? : Object) {
        var parsedObject = JSON.parse(json);
        return buildTypesFromObjects(parsedObject, typedRoot);
    }

}
