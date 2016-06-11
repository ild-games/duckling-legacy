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
import {
    autoDetectRenderer,
    DisplayObject,
    WebGLRenderer,
    CanvasRenderer,
    Graphics,
    Container,
    Point
} from 'pixi.js';
import * as PIXI from 'pixi.js';

import {drawRectangle, drawX, drawGrid} from './drawing/util';
import {BaseTool, ToolService, MapMoveTool} from './tools';
import {Vector} from '../math';
import {isMouseButtonPressed, MouseButton, WindowService} from '../util';

/**
 * The Canvas Component is used to render pixijs display objects and wire up Tools.
 */
@Component({
    selector: 'dk-canvas',
    styleUrls: ['./duckling/canvas/canvas.component.css'],
    template: `
        <div #canvasContainerDiv
            class="canvas-container"
            (mousedown)="forwardContainingDivEvent($event)"
            (mouseUp)="forwardContainingDivEvent($event)"
            (mousemove)="forwardContainingDivEvent($event)"
            (mouseout)="forwardContainingDivEvent($event)">
            <div
                class="canvas-scroll"
                [style.width]="scrollerDimensions.x"
                [style.height]="scrollerDimensions.y">
            </div>
            <canvas
                #canvas
<<<<<<< HEAD
                contentEditable="true"
=======
                class="canvas"
>>>>>>> 0fee658... implement scrolling with the canvas
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
    elementDimensions : Vector = {x: 0, y: 0};
    scrollerDimensions : Vector = {x: 0, y: 0};

    @Input() stageDimensions : Vector;
    @Input() gridSize : number;
    @Input() scale : number;
    @Input() showGrid : boolean;
    @Input() entitiesDisplayObject : DisplayObject;
    @Input() canvasDisplayObject : DisplayObject;
    @Input() gridDisplayObject : DisplayObject;
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

    private _mouseLocation : Vector = {x: 0, y: 0};
    private _stage : Container = new Container();
    private _renderer : WebGLRenderer | CanvasRenderer;
    private _scrollStageOffset = 32;
    private _viewInited = false;

    constructor(private _changeDetector : ChangeDetectorRef,
                private _window : WindowService,
                private _toolService : ToolService) {
    }

    ngAfterViewInit() {
        this._viewInited = true;
        this._window.on('resize', () => this.onResize());
        this.canvasContainerDiv.nativeElement.parentElement.onscroll = () => this.onScroll();
        this._toolService.getTool<MapMoveTool>("MapMoveTool").draggedElement = this.canvasContainerDiv.nativeElement.parentElement;

        this._renderer = new CanvasRenderer(this.elementDimensions.x, this.elementDimensions.y, {view: this.canvasRoot.nativeElement});
        this._renderer.backgroundColor = 0xDFDFDF;
        this.setupStage();
        this.centerStage();
        this.render();
    }

    repositionStage() {
        var canvasScrollDifferenceWidth = this.scrollerDimensions.x - this.elementDimensions.x;
        var canvasScrollDifferenceHeight = this.scrollerDimensions.y - this.elementDimensions.y;
        this._stage.x = (this.elementDimensions.x / 2) + 0.5 + (canvasScrollDifferenceWidth / 2) - this.canvasContainerDiv.nativeElement.parentElement.scrollLeft;
        this._stage.y = (this.elementDimensions.y / 2) + 0.5 + (canvasScrollDifferenceHeight / 2) - this.canvasContainerDiv.nativeElement.parentElement.scrollTop;
    }

    setupStage() {
        this.buildCanvasDisplayObjects();
        this.resizeCanvasElements();
        this.repositionStage();
    }

    buildCanvasDisplayObjects() {
        this.canvasDisplayObject = this.buildCanvasDisplayObject();
        this.gridDisplayObject = this.buildCanvasGrid();
    }

    ngOnChanges(changes : {stageDimensions?:SimpleChange, gridSize?:SimpleChange, scale?:SimpleChange, showGrid?:SimpleChange}) {
        if (!this._viewInited) {
            return;
        }

        if (changes.stageDimensions) {
            this.setupStage();
            this.centerStage();
        } else if (changes.gridSize) {
            this.gridDisplayObject = this.buildCanvasGrid();
        } else if (changes.scale) {
            this.setupStage();
        }

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
            this.tool.onStageDown(this.canvasCoordsFromEvent(event), this.stageCoordsFromEvent(event));
        }
        event.stopPropagation();
    }

    onMouseUp(event : MouseEvent) {
        if (this.tool) {
            this.tool.onStageUp(this.canvasCoordsFromEvent(event), this.stageCoordsFromEvent(event));
        }
        event.stopPropagation();
    }

    onMouseDrag(event : MouseEvent) {
        var position = this.positionFromEvent(event);
        this._mouseLocation = position;
        if (this.tool && isMouseButtonPressed(event, MouseButton.Left)) {
            this.tool.onStageMove(this.canvasCoordsFromEvent(event), this.stageCoordsFromEvent(event));
        }
        event.stopPropagation();
    }


    onMouseOut() {
        if (this.tool) {
            this.tool.onLeaveStage();
        }
        event.stopPropagation();
    }


    onResize() {
        this.resizeCanvasElements();
        this.render();
    }

    onScroll() {
        this.repositionStage();
        this.render();
    }

    resizeCanvasElements() {
        this.elementDimensions.x = this.canvasContainerDiv.nativeElement.clientWidth;
        this.elementDimensions.y = this.canvasContainerDiv.nativeElement.clientHeight;
        this.scrollerDimensions.x = this.elementDimensions.x * 2 + (this.stageDimensions.x * this.scale) - (this._scrollStageOffset * 2);
        this.scrollerDimensions.y = this.elementDimensions.y * 2 + (this.stageDimensions.y * this.scale) - (this._scrollStageOffset * 2);
        this.repositionStage();
        if (this._renderer) {
            this._renderer.view.style.width = this.elementDimensions.x + "px";
            this._renderer.view.style.height = this.elementDimensions.y + "px";
            this._renderer.resize(this.elementDimensions.x, this.elementDimensions.y);
            this._changeDetector.detectChanges();
        }
    }

    private centerStage() {
        this.canvasContainerDiv.nativeElement.parentElement.scrollLeft = (this.scrollerDimensions.x / 2) - (this.elementDimensions.x / 2);
        this.canvasContainerDiv.nativeElement.parentElement.scrollTop = (this.scrollerDimensions.y / 2) - (this.elementDimensions.y / 2);
    }

    private buildCanvasDisplayObject() : DisplayObject {
        var graphics = new Graphics();
        graphics.beginFill(0xFFFFFF, 1);
        drawRectangle(
            {x: 0, y: 0},
            {x: this.stageDimensions.x, y: this.stageDimensions.y},
            graphics);
        graphics.endFill();
        graphics.lineStyle(1, 0xAAAAAA, 1);
        drawRectangle(
            {x: 0, y: 0},
            {x: this.stageDimensions.x, y: this.stageDimensions.y},
            graphics);
        return graphics;
    }

    private buildCanvasGrid() : DisplayObject {
        var graphics = new Graphics();
        graphics.lineStyle(1, 0xEEEEEE, 1);
        drawGrid(
            {x: 0, y: 0},
            {x: this.stageDimensions.x - 2, y: this.stageDimensions.y - 2},
            {x: this.gridSize, y: this.gridSize},
            graphics);
        return graphics;
    }

    stageCoordsFromEvent(event : MouseEvent) : Vector {
        var localPoint = this._stage.toLocal(new Point(event.offsetX, event.offsetY));
        return {
            x: localPoint.x,
            y: localPoint.y
        }
    }

    canvasCoordsFromEvent(event : MouseEvent) : Vector {
        return {
            x: event.offsetX,
            y: event.offsetY
        }
    }

    render() {
        if (this._renderer) {
            this._stage.removeChildren();
            this._stage.addChild(this.canvasDisplayObject);
            this._stage.addChild(this.entitiesDisplayObject);
            if (this.showGrid) {
                this._stage.addChild(this.gridDisplayObject);
            }
            this._stage.scale = new Point(this.scale, this.scale);
            this._renderer.render(this._stage);
        }
    }

    forwardContainingDivEvent(event : MouseEvent) {
        this.canvasRoot.nativeElement.dispatchEvent(new MouseEvent(event.type, event));
    }
}
