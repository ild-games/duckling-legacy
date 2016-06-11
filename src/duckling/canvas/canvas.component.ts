import {
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    AfterViewInit,
    SimpleChange,
    ViewChild,
    ChangeDetectorRef,
    EventEmitter,
    Output
} from 'angular2/core';
import {Observable} from 'rxjs';
import {autoDetectRenderer, DisplayObject, WebGLRenderer, CanvasRenderer} from 'pixi.js';

import {BaseTool} from './tools/base-tool';
import {Vector} from '../math';
import {isMouseButtonPressed, MouseButton, WindowService} from '../util';

/**
 * The Canvas Component is used to render pixijs display objects and wire up Tools.
 */
@Component({
    selector: 'dk-canvas',
    styleUrls: ['./duckling/canvas/canvas.component.css'],
    template: `
        <div #canvasContainerDiv class="canvas-container">
            <canvas
                #canvas
                contentEditable="true"
                (mousedown)="onMouseDown($event)"
                (mouseup)="onMouseUp($event)"
                (mousemove)="onMouseDrag($event)"
                (mouseout)="onMouseOut()"
                (copy)="onCopy($event)"
                (paste)="onPaste($event)"
                [height]="height"
                [width]="width">
            </canvas>
        </div>
    `
})
export class Canvas implements OnChanges, OnDestroy, AfterViewInit {
    width : number = 500;
    height : number = 400;

    @Input() stage : DisplayObject;
    @Input() tool : BaseTool;

    @ViewChild('canvas') canvasRoot : ElementRef;
    @ViewChild('canvasContainerDiv') canvasContainerDiv : ElementRef;

    /**
     * Event that is published when a user trys to copy something in the canvas.
     */
    @Output() elementCopy : EventEmitter<any> = new EventEmitter();

    /**
     * Event that is published whenever a user trys to paste something in the canvas.
     */
    @Output() elementPaste : EventEmitter<Vector> = new EventEmitter();

    private _renderer : WebGLRenderer | CanvasRenderer;
    private _mouseLocation : Vector = {x: 0, y: 0};

    constructor(private _changeDetector : ChangeDetectorRef,
                private _window : WindowService) {
        this._window.on('resize', () => this.onResize());
    }

    ngAfterViewInit() {
        this._renderer = new CanvasRenderer(this.width, this.height, {view: this.canvasRoot.nativeElement});
        this._renderer.backgroundColor = 0xCBCBCB;
        this.onResize();
    }

    ngOnChanges() {
        this.render();
    }

    ngOnDestroy() {
        this._renderer.destroy();
    }

    onCopy(event : ClipboardEvent) {
        this.elementCopy.emit(null);
    }

    onPaste(event : ClipboardEvent) {
        this.elementPaste.emit(this._mouseLocation);
    }

    onMouseDown(event : MouseEvent) {
        this.canvasRoot.nativeElement.focus();
        if (this.tool) {
            this.tool.onStageDown(this.positionFromEvent(event));
        }
    }

    onMouseUp(event : MouseEvent) {
        if (this.tool) {
            this.tool.onStageUp(this.positionFromEvent(event));
        }
    }

    onMouseDrag(event : MouseEvent) {
        var position = this.positionFromEvent(event);
        this._mouseLocation = position;
        if (this.tool && isMouseButtonPressed(event, MouseButton.Left)) {
            this.tool.onStageMove(position);
        }
    }


    onMouseOut() {
        if (this.tool) {
            this.tool.onLeaveStage();
        }
    }

    onResize() {
        this.width = this.canvasContainerDiv.nativeElement.clientWidth;
        this.height = this.canvasContainerDiv.nativeElement.clientHeight;
        if (this._renderer) {
            this._renderer.view.style.width = this.width + "px";
            this._renderer.view.style.height = this.height + "px";
            this._renderer.resize(this.width, this.height);
            this._changeDetector.detectChanges();
        }
        this.render();
    }

    /*private buildBackgroundChild() : DisplayObject {
        var background = new createjs.Shape();
        background.x = -(this.properties.dimensions.x / 2) + 0.5;
        background.y = -(this.properties.dimensions.y / 2) + 0.5;
        background.shadow = new createjs.Shadow(this.gridColor, 0, 0, 5);
        background.graphics
            .setStrokeStyle(1, 0, 0, 10, true)
            .beginStroke(this.gridColor)
            .beginFill("White")
            .drawRect(0, 0, this.properties.dimensions.x, this.properties.dimensions.y);
        return background;
    }*/


    positionFromEvent(event : MouseEvent) : Vector {
        return {
            x: event.offsetX,
            y: event.offsetY
        }
    }

    render() {
        if (this.stage && this._renderer) {
            this.stage.x = 0.5;
            this.stage.y = 0.5;
            this._renderer.render(this.stage);
        }
    }
}
