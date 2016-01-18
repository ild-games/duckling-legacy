///<reference path="BaseTool.ts"/>
module editorcanvas.tools {

    export class MapDragTool extends BaseTool {
        private curPos : math.Vector = new math.Vector();
        private offset : math.Vector = new math.Vector();
        private isDown : boolean = false;
        draggedElement = null;

        onEvent(event) {
            switch (event.nativeEvent.type) {
                case "mousedown":
                    this.onMouseDown(new math.Vector(event.nativeEvent.clientX, event.nativeEvent.clientY));
                    break;
                case "mouseup":
                    this.onMouseUp();
                    break;
                case "mousemove":
                    this.onMouseMove(new math.Vector(event.nativeEvent.clientX, event.nativeEvent.clientY));
                    break;
            }
        }

        onMouseDown(position : math.Vector) {
            this.isDown = true;
            this.curPos = position;
            if (this.draggedElement) {
                this.offset = new math.Vector(this.draggedElement.scrollLeft, this.draggedElement.scrollTop);
            }
        }

        onMouseUp() {
            this.isDown = false;
        }

        onMouseMove(position : math.Vector) {
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
}
