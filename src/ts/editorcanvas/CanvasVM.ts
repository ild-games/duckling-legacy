///<reference path="../framework/ViewModel.ts"/>
module editorcanvas {

    class AddRectangleCommand implements framework.command.Command {
        private _rectangle : drawing.Rectangle;
        private _rectangles : framework.observe.ObservableArray<drawing.Rectangle>;

        constructor(rect : drawing.Rectangle, rects : framework.observe.ObservableArray<drawing.Rectangle>) {
            this._rectangle = rect;
            this._rectangles = rects;
        }

        execute() {
            this._rectangles.push(this._rectangle);
        }

        undo() {
            this._rectangles.popBack();
        }
    }


    /**
     * ViewModel for the main canvas used to interact with entities.
     */
    export class CanvasVM extends framework.ViewModel<any> implements framework.observe.Observer {
        private _rectangles : framework.observe.ObservableArray<drawing.Rectangle>;
        private _canvas : HTMLCanvasElement;
        private _canvasContext : CanvasRenderingContext2D;

        constructor() {
            super();
            this.registerCallback("create-rectangle", this.createRectangle);
            this.registerCallback("undo", this.undo);
            this.registerCallback("redo", this.redo);
            this.registerCallback("clear", this.clear);

            this._rectangles = new framework.observe.ObservableArray<drawing.Rectangle>();
            this._rectangles.listenForChanges("Rectangles", this);
        }

        private createRectangle(event, argument) {
            var topCorner = new drawing.CanvasPoint(event.offsetX, event.offsetY);
            var bottomCorner = new drawing.CanvasPoint(topCorner.x + 20, topCorner.y + 10);
            var cmd = new AddRectangleCommand(new drawing.Rectangle(topCorner, bottomCorner), this._rectangles);
            this._context.CommandQueue.pushCommand(cmd);
        }

        private undo() {
            this._context.CommandQueue.undo();
        }

        private redo() {
            this._context.CommandQueue.redo();
        }

        private clear() {
            this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this._canvasContext.beginPath();
        }

        onReady() {
            this._canvas = <HTMLCanvasElement>document.getElementById("entity-canvas");
            this._canvasContext = <CanvasRenderingContext2D>this._canvas.getContext("2d");
        }

        onDataChanged(key:string, event:framework.observe.DataChangeEvent) {
            this.clear();
            this._rectangles.forEach((rectangle) => rectangle.draw(this._canvasContext));
            this._canvasContext.stroke();
        }

        /**
         * @see ViewModel.viewFile
         */
        get viewFile() : string {
            return "canvas";
        }
    }
}