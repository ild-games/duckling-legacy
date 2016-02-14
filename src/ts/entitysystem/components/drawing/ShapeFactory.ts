import VMFactory from '../../../framework/VMFactory';
import Shape from './Shape';

interface ShapeFactory extends VMFactory {
    createShape() : Shape;
}

export default ShapeFactory;
