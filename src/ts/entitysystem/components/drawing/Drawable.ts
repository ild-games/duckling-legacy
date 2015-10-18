///<reference path="../../../framework/observe/Observable.ts"/>
module entityframework.components.drawing {

    import serialize = util.serialize;
    import observe = framework.observe;

    /**
     * Represents an object that can be drawn in the game.
     */
    export class Drawable extends framework.observe.Observable {
        @observe.Primitive(Number)
        private renderPriority : number;

        @observe.Primitive(Number)
        private priorityOffset : number;

        @observe.Primitive(Number)
        private rotation : number;

        @observe.Object()
        private positionOffset : math.Vector = new math.Vector();

        @observe.Primitive(Boolean)
        private inactive : boolean;

        @observe.Object()
        private scale : math.Vector = new math.Vector(1.0, 1.0);

        @observe.Primitive()
        key : string;

        constructor(key : string) {
            super();
            this.key = key;
        }
    }
}
