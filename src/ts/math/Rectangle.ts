import SimpleObservable from '../framework/observe/SimpleObservable';
import {ObservePrimitive} from '../framework/observe/ObserveDecorators';

export default class Rectangle extends SimpleObservable {
    @ObservePrimitive(Number)
    left : number;

    @ObservePrimitive(Number)
    top : number;

    @ObservePrimitive(Number)
    width : number;

    @ObservePrimitive(Number)
    height : number;

    constructor(left? : number, top? : number, width? : number, height? : number) {
        super();
        this.left = left || 0;
        this.top = top || 0;
        this.width = width || 0;
        this.height = height || 0;
    }
}
