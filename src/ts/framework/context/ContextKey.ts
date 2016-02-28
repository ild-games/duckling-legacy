import contextKeySymbol from './ContextKeySymbol';
/**
* Class decorator that allows the object to be retrieved from the context.
* @param key Key the object can be retrieved by.
*/
export default function ContextKey(key) {
    return function(target : any) {
        target[contextKeySymbol] = key;
    }
}
