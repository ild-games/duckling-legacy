import SimpleObservable from '../../../framework/observe/SimpleObservable';
import {ObservePrimitive} from '../../../framework/observe/ObserveDecorators';

export default class Color extends SimpleObservable {

    @ObservePrimitive(Number)
    r : number;
    @ObservePrimitive(Number)
    g : number;
    @ObservePrimitive(Number)
    b : number;
    @ObservePrimitive(Number)
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
