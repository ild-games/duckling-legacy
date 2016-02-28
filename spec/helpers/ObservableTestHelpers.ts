import {ObservePrimitive, ObserveObject} from '../../src/ts/framework/observe/ObserveDecorators';
import {ProvideClass} from '../../src/ts/util/serialize/Decorators';
import SimpleObservable from '../../src/ts/framework/observe/SimpleObservable';

@ProvideClass(SimpleObservableA, "helpers.SimpleObservableA")
export class SimpleObservableA extends SimpleObservable {
    @ObservePrimitive(String)
    stringValue = "";

    @ObserveObject()
    child : SimpleObservableA = null;

    constructor(child? : SimpleObservableA) {
        super();
        this.child = child;
    }
}

export function makeSimpleObservableTree(depth : number) {
    if (depth <= 0) {
        return null;
    } else {
        return new SimpleObservableA(makeSimpleObservableTree(depth - 1));
    }
}
