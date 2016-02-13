module helpers {

    import observe = framework.observe;

    @util.serialize.ProvideClass(SimpleObservableA, "helpers.SimpleObservableA")
    export class SimpleObservableA extends observe.SimpleObservable {
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
}
