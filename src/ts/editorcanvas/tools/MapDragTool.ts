import Vector from '../../math/Vector';
import BaseTool from './BaseTool';

export default class MapDragTool extends BaseTool {
    private curPos : Vector = new Vector();
    private offset : Vector = new Vector();
    private isDown : boolean = false;
    draggedElement = null;

    onEvent(event) {
        switch (event.nativeEvent.type) {
            case "mousedown":
            this.onMouseDown(new Vector(event.nativeEvent.clientX, event.nativeEvent.clientY));
            break;
            case "mouseup":
            this.onMouseUp();
            break;
            case "mousemove":
            this.onMouseMove(new Vector(event.nativeEvent.clientX, event.nativeEvent.clientY));
            break;
        }
    }

    onMouseDown(position : Vector) {
        this.isDown = true;
        this.curPos = position;
        if (this.draggedElement) {
            this.offset = new Vector(this.draggedElement.scrollLeft, this.draggedElement.scrollTop);
        }
    }

    onMouseUp() {
        this.isDown = false;
    }

    onMouseMove(position : Vector) {
        if (this.isDown && this.draggedElement) {
            var scrollToX = this.offset.x + (this.curPos.x - position.x);
            var scrollToY = this.offset.y + (this.curPos.y - position.y);

            this.draggedElement.scrollLeft = scrollToX;
            this.draggedElement.scrollTop = scrollToY;
        }
    }

    get key() : string {
        return "mapMove";
    }

    get label() : string {
        return "Map Move";
    }
}
