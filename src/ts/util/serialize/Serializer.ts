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
        if (!typedRoot) {
            typedRoot = parsedObject;
        }
        var context = new SerializationContext();
        return context.initInstance(parsedObject, typedRoot);
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
                try {
                    replacement[getKeyOverride(value, propKey)] = value[propKey];
                } catch(e) {
                    replacement[getKeyOverride(value, propKey)] = value.val()[propKey];
                }
            } else {
                try {
                    replacement[propKey] = value[propKey];
                } catch(e) {
                    replacement[propKey] = value.val()[propKey];
                }
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
    export module errors {
        /**
         * Create an error describing a mismatch between the typed object being
         * deserialized and the json object being read.
         * @param keyName Key that is the source of the error.
         * @param jsonValue Value found in the json object.
         * @param jsValue Value found in the typed object.
         */
        export function createInvalidJSONError(fullKeyPath, jsonValue, jsValue) {
            return Error(`Unable to serialize ${fullKeyPath}`);
        }
    }

    /**
     * FieldTypes is an enum containing the approximation for all javascript types.
     */
    enum FieldType {
        Undefined,
        Null,
        Function,
        AnnotatedObject, // An plain old js object with a JSON_TYPE_KEY
        CustomSerializer, // An instace of a class that implements CustomSerializer
        Array,
        Object,
        Primitive,
    }

    function getFieldType(field) {
        if (field === undefined) {
            return FieldType.Undefined;
        } else if (field === null) {
            return FieldType.Null;
        } else if (typeof field === "function") {
            return FieldType.Function;
        } else if (field[JSON_TYPE_KEY]) {
            return FieldType.AnnotatedObject;
        } else if (getCustomSerializer(field)) {
            return FieldType.CustomSerializer;
        } else if (Array.isArray(field)) {
            return FieldType.Array;
        } else if (typeof field === "object") {
            return FieldType.Object;
        } else {
            return FieldType.Primitive;
        }
    }

    enum DeserializationAction {
        Unknown,
        CustomSerializer,
        BootstrapAnnotated,
        InitInstance,
        InitData,
        DataValue,
        InstanceValue,
        Error
    }

    //ActionTable is a table of the form ActionTable[JSONFieldType][TypedRootFieldType] = DeserializationAction
    var ActionTable = {};
    function addTableEntry(jsonFieldType : FieldType, typedRootFieldType : FieldType, action : DeserializationAction) {
        if (!ActionTable[jsonFieldType]) {
            ActionTable[jsonFieldType] = {};
        }
        ActionTable[jsonFieldType][typedRootFieldType] = action;
    }

    function getAction(jsonField : any, typedRootField : any) : DeserializationAction {
        var jsonType = getFieldType(jsonField);
        var rootType = getFieldType(typedRootField);
        if (!ActionTable[jsonType]) {
            return DeserializationAction.Unknown;
        } else if (!ActionTable[jsonType][rootType]) {
            return DeserializationAction.Unknown;
        } else {
            return ActionTable[jsonType][rootType];
        }
    }

    addTableEntry(FieldType.Object, FieldType.Null, DeserializationAction.InitData);
    addTableEntry(FieldType.Object, FieldType.Object, DeserializationAction.InitInstance);
    addTableEntry(FieldType.Object, FieldType.CustomSerializer, DeserializationAction.CustomSerializer);
    addTableEntry(FieldType.Object, FieldType.Function, DeserializationAction.Error);
    addTableEntry(FieldType.Object, FieldType.Array, DeserializationAction.Error);
    addTableEntry(FieldType.Object, FieldType.Primitive, DeserializationAction.Error);
    addTableEntry(FieldType.Object, FieldType.Undefined, DeserializationAction.Error);

    addTableEntry(FieldType.AnnotatedObject, FieldType.Null, DeserializationAction.BootstrapAnnotated);
    addTableEntry(FieldType.AnnotatedObject, FieldType.AnnotatedObject, DeserializationAction.BootstrapAnnotated);
    addTableEntry(FieldType.AnnotatedObject, FieldType.Object, DeserializationAction.BootstrapAnnotated);
    addTableEntry(FieldType.AnnotatedObject, FieldType.CustomSerializer, DeserializationAction.CustomSerializer);
    addTableEntry(FieldType.AnnotatedObject, FieldType.Function, DeserializationAction.Error);
    addTableEntry(FieldType.AnnotatedObject, FieldType.Array, DeserializationAction.Error);
    addTableEntry(FieldType.AnnotatedObject, FieldType.Primitive, DeserializationAction.Error);
    addTableEntry(FieldType.AnnotatedObject, FieldType.Undefined, DeserializationAction.Error);

    addTableEntry(FieldType.Array, FieldType.Null, DeserializationAction.InitData);
    addTableEntry(FieldType.Array, FieldType.Array, DeserializationAction.InitData);
    addTableEntry(FieldType.Array, FieldType.CustomSerializer, DeserializationAction.CustomSerializer);
    addTableEntry(FieldType.Array, FieldType.Object, DeserializationAction.Error);
    addTableEntry(FieldType.Array, FieldType.Primitive, DeserializationAction.Error);
    addTableEntry(FieldType.Array, FieldType.Function, DeserializationAction.Error);
    addTableEntry(FieldType.Array, FieldType.Undefined, DeserializationAction.Error);

    addTableEntry(FieldType.Null, FieldType.Null, DeserializationAction.DataValue);
    addTableEntry(FieldType.Null, FieldType.Object, DeserializationAction.DataValue);
    addTableEntry(FieldType.Null, FieldType.Array, DeserializationAction.DataValue);
    addTableEntry(FieldType.Null, FieldType.CustomSerializer, DeserializationAction.CustomSerializer);
    addTableEntry(FieldType.Null, FieldType.Primitive, DeserializationAction.Error);
    addTableEntry(FieldType.Null, FieldType.Function, DeserializationAction.Error);
    addTableEntry(FieldType.Null, FieldType.Undefined, DeserializationAction.Error);

    addTableEntry(FieldType.Undefined, FieldType.Null, DeserializationAction.Error);
    addTableEntry(FieldType.Undefined, FieldType.Object, DeserializationAction.Error);
    addTableEntry(FieldType.Undefined, FieldType.Primitive, DeserializationAction.Error);
    addTableEntry(FieldType.Undefined, FieldType.Array, DeserializationAction.Error);
    addTableEntry(FieldType.Undefined, FieldType.CustomSerializer, DeserializationAction.Error);
    addTableEntry(FieldType.Undefined, FieldType.Undefined, DeserializationAction.Error);
    addTableEntry(FieldType.Undefined, FieldType.Function, DeserializationAction.Error);

    addTableEntry(FieldType.Primitive, FieldType.Primitive, DeserializationAction.DataValue);
    addTableEntry(FieldType.Primitive, FieldType.CustomSerializer, DeserializationAction.CustomSerializer);
    addTableEntry(FieldType.Primitive, FieldType.Array, DeserializationAction.Error);
    addTableEntry(FieldType.Primitive, FieldType.Function, DeserializationAction.Error);
    addTableEntry(FieldType.Primitive, FieldType.Null, DeserializationAction.Error);
    addTableEntry(FieldType.Primitive, FieldType.Object, DeserializationAction.Error);
    addTableEntry(FieldType.Primitive, FieldType.Undefined, DeserializationAction.Error);

    /**
     * Used to initialize a typed object from a plain old javascript object.
     */
    export class SerializationContext {
        private keyStack : string [] = [];

        /**
         * When JSON is loaded from disk it returns an object tree of plain old javascript objects (pojo)
         * (I.E. Not instances of classes). This functions takes the pojo tree created
         * by parsing the JSON and the root instance of a class hierarchy.  It walks down the plain
         * old javascript object and sets the corresponding values on the tree of class instances.
         * It also inspects the pojo tree for type name ("__cpp_type" keys).  When a type name
         * is found an object of the described class is created and values from the pojo tree are set on the
         * new class instance.
         * @param dataValue Tree of plain objects created during the parse process (pojo tree).
         * @param instanceValue Instance of a class that the pojo tree should be assigned to.
         * @param key The key that is currently being initialized.
         * @returns The rootResultObject after being initialized with the data in the pojo tree.
         */
        initInstance(dataValue : any, instanceValue : any, key : string = "") {
            this.pushKey(key);
            var result : any;
            switch (getAction(dataValue, instanceValue)) {
                case DeserializationAction.InstanceValue:
                    result = instanceValue;
                    break;
                case DeserializationAction.DataValue:
                    result = dataValue;
                    break;
                case DeserializationAction.CustomSerializer:
                    result = getCustomSerializer(instanceValue).fromJSON(dataValue, this);
                    break;
                case DeserializationAction.BootstrapAnnotated:
                    var annotatedInstance = this.getAnnotatedInstance(dataValue);
                    this.removeAnnotation(dataValue);
                    result = this.initChildren(dataValue, annotatedInstance);
                    break;
                case DeserializationAction.InitInstance:
                    result = this.initChildren(dataValue, instanceValue);
                    break;
                case DeserializationAction.InitData:
                    result = this.initChildren(dataValue, dataValue);
                    break;
                case DeserializationAction.Error:
                    throw errors.createInvalidJSONError(this.keyStack.join("."), dataValue, instanceValue);
                case DeserializationAction.Unknown:
                    throw Error("Unknown deserialization action");
            }
            this.popKey();
            return result;
        }

        private initChildren(dataValue, instanceValue) {
            var dataType = getFieldType(dataValue);
            var instanceType = getFieldType(instanceValue);
            if (dataType === FieldType.Object && instanceType === FieldType.Object && dataType === instanceType) {
                return this.initObject(dataValue, instanceValue)
            } else if (dataType === FieldType.Array && instanceType === FieldType.Array && dataType === instanceType) {
                return this.initArray(dataValue);
            } else {
                throw Error("Unexpected types in initChildren");
            }
        }

        private initArray(dataArray : any[]) {
            return dataArray.map((item, index) => {
                if (getFieldType(item) == FieldType.Primitive) {
                    return item;
                } else {
                    return this.initInstance(item, null, String(index));
                }
            });
        }

        private initObject(dataObject, instanceObject) {
            Object.keys(dataObject).forEach((key) => {
                instanceObject[key] = this.initInstance(dataObject[key], instanceObject[key], key);
            });
            return instanceObject;
        }

        private removeAnnotation(annotatedData) {
            delete annotatedData[JSON_TYPE_KEY];
        }

        private getAnnotatedInstance(annotatedData) {
            return new (getClassForName(annotatedData[JSON_TYPE_KEY]));
        }

        private pushKey(key : string) {
            if (key === "") {
                if (this.keyStack.length === 0) {
                    this.keyStack.push("__root__");
                } else {
                    throw Error("Must pass a key to initializeInstance if not the root");
                }
            } else {
                this.keyStack.push(key);
            }
        }

        private popKey() {
            this.keyStack.pop();
        }
    }
    //endregion
}
