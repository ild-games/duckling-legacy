import SimpleObservable from '../framework/observe/SimpleObservable';
import {ObservePrimitive} from '../framework/observe/ObserveDecorators';

/**
 * A 2D vector.
 */
export default class Vector extends SimpleObservable {
    @ObservePrimitive(Number)
    x : number;

    @ObservePrimitive(Number)
    y : number;

    /**
     * Construct a new vector.
     * @param x Optional initial x.
     * @param y Optional initial y.
     */
    constructor(x? : number, y? : number) {
        super();
        this.x = x || 0;
        this.y = y || 0;
    }
}
