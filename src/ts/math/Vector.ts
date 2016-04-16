import CommandQueue from '../framework/command/CommandQueue';
import createSetter from '../framework/command/CreateSetter';
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

    /**
     * Creates a function that can be used to set values with a command.
     * @param  {CommandQueue} commands The command queue that will have the command pushed onto.
     * @return A function that takes in an x and y to set for this vector and pushes it onto the command queue.
     */
    createSetter(commands : CommandQueue) : (x: number, y: number) => void {
        var xSetter = createSetter(commands, this, "x");
        var ySetter = createSetter(commands, this, "y");
        return (x : number, y : number) => {
            if (x !== this.x) {
                xSetter(x);
            }
            if (y !== this.y) {
                ySetter(y);
            }
        }
    }
}
