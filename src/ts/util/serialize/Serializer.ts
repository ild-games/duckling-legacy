///<reference path="Decorators.ts"/>
module util.serialize {
    const JSON_TYPE_KEY = "__cpp_type";

    /**
     * Serialize the object into JSON.
     * @param object Object that should be serialized.
     * @returns A JSON string representing the object.
     */
    export function serialize(object : Object) {
        return JSON.stringify(object, replacer, 2);
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

    //region serialize implementation
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

        if (isPrimitiveOrArray(value)) {
            return value;
        }

        return getObjectAfterKeyOverrides(value);
    }

    function isPrimitiveOrArray(value) {
        return typeof  value !== "object" || value === null || Array.isArray(value);
    }

    /**
     * Copy the value into a new object in order to apply key overrides.
     * @param value Object to copy into a new object.
     * @returns New object with the old key values overridden by the key overrides.
     */
    function getObjectAfterKeyOverrides(value) {
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
    //endregion

    //region deserialize implementation
    /**
     * When JSON is loaded from disk it returns an object tree of plain old javascript objects (pojo)
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
        if (types.isPrimitive(plainObjectTree)) {
            return plainObjectTree;
        }

        var rootTypedObject = getRootTypedObject(plainObjectTree, rootResultObject);

        if (Array.isArray(rootTypedObject)) {
            return buildTypedArray(plainObjectTree, rootTypedObject);
        }

        return buildTypedObject(plainObjectTree, rootTypedObject);
    }

    /**
     * Get the root object that will be returned after the function is done inflating
     * a typed object from the json tree.
     * @param plainObjectTree The plain javascript object produced by deserializing json.
     * @param rootTypedObject (Optional) Object that will be initialized using the json tree.
     * @returns The object to initialize using the parsed json object.
     */
    function getRootTypedObject(plainObjectTree, rootTypedObject?) {
        if (rootTypedObject) {
            return rootTypedObject;
        } else if (types.isArray(plainObjectTree)) {
            rootTypedObject = [];
        } else if (plainObjectTree[JSON_TYPE_KEY]) {
            rootTypedObject = new (getClassForName(plainObjectTree[JSON_TYPE_KEY]));
        } else if (types.isObject(plainObjectTree)) {
            rootTypedObject = {};
        } else {
            rootTypedObject = null;
        }
        return rootTypedObject;
    }

    /**
     * Called if the result of parsing the json is an array.
     * @param plainObjectTree Object produced by parsing JSON.
     * @param rootTypedObject Object the json string will be parsed into.
     * @returns The rootTypeObject array filled with typed objects initialized from the json object.
     */
    function buildTypedArray(plainObjectTree, rootTypedObject : Array<any>) {
        plainObjectTree.forEach(function(child) {
            rootTypedObject.push(buildTypesFromObjects(child));
        });
        return rootTypedObject;
    }

    /**
     * Called if the result of parsing the json is an object.
     * @param plainObjectTree Object produced by parsing JSON.
     * @param rootTypedObject Object the json string will be parsed into.
     * @returns The rootTypeObject initialized using the values from the plainObjectTree.
     */
    function buildTypedObject(plainObjectTree, rootTypedObject) {
        for (var key in plainObjectTree) {
            if (key === JSON_TYPE_KEY) {
                continue;
                // Ignore the Key
            }

            var typedValue = rootTypedObject[key];
            var plainValue = plainObjectTree[key];

            if (getCustomSerializer(typedValue)) {
                getCustomSerializer(typedValue).fromJSON(buildTypesFromObjects(plainValue));
            } else if (typedValue) {
                buildTypesFromObjects(plainValue, typedValue)
            } else if (types.isPrimitive(plainValue)) {
                rootTypedObject[key] = plainValue;
            } else {
                rootTypedObject[key] = buildTypesFromObjects(plainValue);
            }
        }
        return rootTypedObject;
    }
    //endregion
}
