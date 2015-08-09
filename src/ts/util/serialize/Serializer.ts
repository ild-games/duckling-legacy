///<reference path="Decorators.ts"/>
module util.serialize {
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

        var replacement = {};
        for (var propKey in value) {
            if (isKeyOverriden(value, propKey)) {
                replacement[getKeyOverride(value, propKey)] = value[propKey];
            } else {
                replacement[propKey] = value[propKey];
            }
        }

        if (getTypeName(value)) {
            replacement["__cpp_type"] = getTypeName(value);
        }

        copySymbols(value, replacement);

        return replacement;
    }

    export function serialize(object : Object) {
        return JSON.stringify(object, replacer, 2);
    }

    export function deserialize(json : string, object : Object) {
        return null;
    }

}
