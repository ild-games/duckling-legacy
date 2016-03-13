import CommandQueue from './CommandQueue';
import {setter} from './SetterCommand';

/**
 * Creates a setter that can be passed to react components.
 *
 * Ex: createSetter(commandQueue, collisionComponent, "bodyType");
 * @type {CommandQueue}
 */
export default function createSetter<T>(commands : CommandQueue, object : T, key : string) : (value : any) => void {
    var sym = Symbol();
    return function(val : any) {
        var cmd = setter(val, object[key], (newVal) => object[key] = newVal, sym);
        commands.pushCommand(cmd);
    }
}
