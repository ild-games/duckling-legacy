import {ObserveObject} from '../../../framework/observe/ObserveDecorators';
import SimpleObservable from '../../../framework/observe/SimpleObservable';
import * as serialize from '../../../util/serialize/Decorators';
import Color from './Color';
import ShapeType from './ShapeType';
import ShapeFactory from './ShapeFactory';
import ShapeTypeToFactory from './ShapeTypeToFactory';

/**
*  Model object describing a shape.
*/
export default class Shape extends SimpleObservable {
    @ObserveObject()
    fillColor : Color;

    constructor(fillColor? : Color) {
        super();
        this.fillColor = fillColor || new Color(0, 0, 0, 255);
    }

    getDrawable() : createjs.DisplayObject {
        throw new Error("This method is abstract");
    }

    @serialize.Ignore
    get type() : ShapeType {
        throw new Error("This method is abstract");
    }

    @serialize.Ignore
    get factory() : ShapeFactory {
        return ShapeTypeToFactory[ShapeType[this.type]];
    }
}
