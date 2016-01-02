///<reference path="../util/JsonLoader.ts"/>
module math {
    import observe = framework.observe;

    export class Rectangle extends framework.observe.SimpleObservable {
        @observe.Primitive(Number)
        left : number;

        @observe.Primitive(Number)
        top : number;

        @observe.Primitive(Number)
        width : number;

        @observe.Primitive(Number)
        height : number;

        constructor(left? : number, top? : number, width? : number, height? : number) {
            super();
            this.left = left || 0;
            this.top = top || 0;
            this.width = width || 0;
            this.height = height || 0;
        }
    }
}
