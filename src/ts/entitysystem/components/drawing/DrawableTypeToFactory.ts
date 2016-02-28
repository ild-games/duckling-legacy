import {ContainerDrawableFactory} from './ContainerDrawable';
import {ImageDrawableFactory} from './ImageDrawable';
import {ShapeDrawableFactory} from './ShapeDrawable';
export default {
    Container: new ContainerDrawableFactory(),
    Shape: new ShapeDrawableFactory(),
    Image: new ImageDrawableFactory()
};
