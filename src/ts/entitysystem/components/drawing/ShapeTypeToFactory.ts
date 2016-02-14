import {RectangleShapeFactory} from './RectangleShape';
import {CircleShapeFactory} from './CircleShape';
export default {
    Rectangle: new RectangleShapeFactory(),
    Circle: new CircleShapeFactory()
}
