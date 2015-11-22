module helpers {

    import observe = framework.observe;
    import serialize = util.serialize;

    export class ObservableTypedRoot extends observe.SimpleObservable {
        @observe.Object()
        object : SimpleObservableA;

        @observe.Primitive()
        array : number[];

        @observe.Primitive()
        nill : any;

        @observe.Primitive()
        undef : any;

        @observe.Primitive()
        primitive : number;

        aMethod() {
            return {};
        }

        constructor() {
            super();
            this.object = makeSimpleObservableTree(2);
            this.array = [1,2,3,4];
            this.nill = null;
            this.undef = undefined;
            this.primitive = 424242;
        }
    }

    export class SimpleCustomSerializer implements serialize.CustomSerializer {
        toJSON() {
            return "";
        }

        fromJSON(object) {
            return object;
        }
    }

    export class SimpleTypedRoot {
        object : SimpleObservableA;

        array : number[];

        nill : any;

        undef : any;

        primitive : number;

        aMethod() {
            return {};
        }

        constructor() {
            this.object = makeSimpleObservableTree(2);
            this.array = [1,2,3,4];
            this.nill = null;
            this.undef = undefined;
            this.primitive = 42;
        }
    }
}
