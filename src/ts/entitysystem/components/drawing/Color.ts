module entityframework.components.drawing {
    import serialize = util.serialize;
    import observe = framework.observe;

    export class Color extends observe.SimpleObservable {

        @observe.Primitive(Number)
        r : number;
        @observe.Primitive(Number)
        g : number;
        @observe.Primitive(Number)
        b : number;
        @observe.Primitive(Number)
        a : number;

        constructor(r : number, g : number, b : number, a : number) {
            super();
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        rgbaStringFormat() : string {
            return "rgba(" + this.r + "," + this.g + "," + this.b + "," + (this.a / 255) + ")";
        }
    }
}
