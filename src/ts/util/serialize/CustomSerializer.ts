module util.serialize {

    var customSerializerSymbol = Symbol("HasCustomSerializer");

    /**
     * Used to decorate a class that implements the CustomSerializer interface.
     * @param classObject The class object that implements the custom serializer.
     */
    export function HasCustomSerializer(classObject) : any {
        classObject[customSerializerSymbol] = classObject;
        return classObject;
    }

    /**
     * Get a custom serializer for the object.
     * @param instance Instance of a class that implements custom serializer.
     * @returns Instance that implements a custom serializer.
     */
    export function getCustomSerializer(instance) {
        if (instance && instance.constructor[customSerializerSymbol]) {
            return instance;
        }
        return null;
    }

    /**
     * Interface that should be implemented by
     */
    export interface CustomSerializer {
        /**
         * Return the object that should represent the object in JSON.
         */
        toJSON(context : SerializationContext) : any;

        /**
         * Takes the JSON representation of the object and produces
         * @param object
         */
        fromJSON(object, conted : SerializationContext) : any;
    }
}
