module util.symbol {

    /**
     * Check if the symbol is attached to the object. If it is not
     * @param classInstance Instance of the a class to retrieve the classes symbols from.
     * @param symbol Symbol the values should be retrieved for.
     * @returns The object stored using the symbol on the object's class.
     */
    export function getSymbolFromObject(classInstance : Object, symbol : symbol | string) {
        return classInstance[symbol] || null;
    }

    /**
     * Get the map set on the class using the symbol.  If the class already has
     * a map for the symbol, then the existing one will be returned. If the class
     * does not have one, but its parent class does, then the parents class map
     * will be used as a prototype for the map on the child.  If the child does not
     * have a map and the parent does not have one then a new object will be
     * initialized.
     *
     * Note: This should only be used while the classes are being initialized.  If
     * you are working with an object initialized from a class you should call
     * getSymbolFromObject. You can call getSymbolFromObject on classes, it just
     * won't create a map if it doesn't exist.
     *
     * @param classObject Class that the symbol map is attached to.
     * @param symbol Symbol that the map is attached to the class as.
     * @returns The map attached using the symbol.  Will create a map if it doesn't
     *   already exist.
     */
    export function getSymbolMapForClass(classObject, symbol : symbol | string) {
        if (!classObject[symbol]) {
            classObject[symbol] = {};
        } else if (!classObject.hasOwnProperty(symbol)) {
            classObject[symbol] = Object.create(classObject[symbol]);
        }
        return classObject[symbol];
    }

    /**
     * Copy the symbol map from the source object ot a destination.  After the copy
     * the objects share the same instance of the map.
     * @param source Source object the map is copied from.
     * @param destination Destination the object is copied from.
     */
    export function copySymbolMap(source : Object, destination : Object, symbol : symbol | string) {
        if (source[symbol]) {
            destination[symbol] = source[symbol];
        }
    }
}
