import VMFactory from '../../../framework/VMFactory';
import Drawable from './Drawable'

interface DrawableFactory extends VMFactory {
    createDrawable(key : string) : Drawable;
}
export default DrawableFactory;
