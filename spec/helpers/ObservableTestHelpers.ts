module helpers {

    import observe = framework.observe;

    export class SimpleObservableA extends observe.SimpleObservable {
        @observe.Primitive(String)
        stringValue;

        @observe.Object()
        child : SimpleObservableA;

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
