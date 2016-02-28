import Vector from '../../math/Vector';

/**
* Defines what all elements that can be drawn to the canvas must do.
*/
interface CanvasDrawnElement {
    /**
    * Return an element that can be rendered on a stage.
    */
    getDrawable(position : Vector) : createjs.DisplayObject;
}
export default CanvasDrawnElement;
