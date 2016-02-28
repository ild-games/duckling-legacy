import Context from '../../framework/context/Context';
import CanvasVM from '../CanvasVM';

/**
* A Tool provides functionality to interact with the canvas and entities on the
* canvas.
*/
interface Tool {
    key : string;
    label : string;
    /**
    * Hook to bind the context this tool is used with.
    */
    onBind(context : Context);

    /**
    * Hook to dispatch the events a tool cares about.
    */
    onEvent(event, canvas : CanvasVM);

    /**
    * Returns the EaselJS DisplayObject that represents this tool for the canvas.
    */
    getDisplayObject() : createjs.DisplayObject;
}
export default Tool;
