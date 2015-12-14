///<reference path="../util/JsonLoader.ts"/>
module math {
    import serialize = util.serialize;
    import observe = framework.observe;

    /**
     * A 2D vector.
     */
    export class Vector extends framework.observe.SimpleObservable {
        @observe.Primitive(Number)
        x : number;

        @observe.Primitive(Number)
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
}
