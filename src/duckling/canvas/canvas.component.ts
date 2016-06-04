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
        <div #canvasContainerDiv
            class="canvas-container"
            (mousedown)="forwardContainingDivEvent($event)"
            (mouseUp)="forwardContainingDivEvent($event)"
            (mousemove)="forwardContainingDivEvent($event)"
            (mouseout)="forwardContainingDivEvent($event)">
            <div
                class="canvas-scroll"
                [style.width]="canvasScrollWidth"
                [style.height]="canvasScrollHeight">
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
    stageWidth : number = 1200;
    stageHeight : number = 808;
    canvasWidth : number = 500;
    canvasHeight : number = 400;
    canvasScrollWidth : number = 1200;
    canvasScrollHeight : number = 800;
    gridSize : number = 16;
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

    constructor(private _changeDetector : ChangeDetectorRef,
                private _window : WindowService) {
        this._window.on('resize', () => this.onResize());
    }

    ngAfterViewInit() {
        this._renderer = new CanvasRenderer(this.canvasWidth, this.canvasHeight, {view: this.canvasRoot.nativeElement});
        this._renderer.backgroundColor = 0xDFDFDF;
        this.canvasDisplayObject = this.buildCanvasDisplayObject();
        this.gridDisplayObject = this.buildCanvasGrid();
        this.canvasContainerDiv.nativeElement.parentElement.onscroll = () => {
            this.repositionStage();
            this.render();
        };
        this.onResize();
        this.centerStage();
    }

    repositionStage() {
        var canvasScrollDifferenceWidth = this.canvasScrollWidth - this.canvasWidth;
        var canvasScrollDifferenceHeight = this.canvasScrollHeight - this.canvasHeight;
        this._stage.x = (this.canvasWidth / 2) + 0.5 + (canvasScrollDifferenceWidth / 2) - this.canvasContainerDiv.nativeElement.parentElement.scrollLeft;
        this._stage.y = (this.canvasHeight / 2) + 0.5 + (canvasScrollDifferenceHeight / 2) - this.canvasContainerDiv.nativeElement.parentElement.scrollTop;
    }

    ngOnChanges(changes : {stage?:SimpleChange}) {
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
        event.stopPropagation();
    }

    onMouseUp(event : MouseEvent) {
        if (this.tool) {
            this.tool.onStageUp(this.positionFromEvent(event));
        }
        event.stopPropagation();
    }

    onMouseDrag(event : MouseEvent) {
        var position = this.positionFromEvent(event);
        this._mouseLocation = position;
        if (this.tool && isMouseButtonPressed(event, MouseButton.Left)) {
            this.tool.onStageMove(position);
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
        this.canvasWidth = this.canvasContainerDiv.nativeElement.clientWidth;
        this.canvasHeight = this.canvasContainerDiv.nativeElement.clientHeight;
        this.canvasScrollWidth = this.canvasWidth * 2 + this.stageWidth - (this._scrollStageOffset * 2);
        this.canvasScrollHeight = this.canvasHeight * 2 + this.stageHeight - (this._scrollStageOffset * 2);
        this.repositionStage();
        if (this._renderer) {
            this._renderer.view.style.width = this.canvasWidth + "px";
            this._renderer.view.style.height = this.canvasHeight + "px";
            this._renderer.resize(this.canvasWidth, this.canvasHeight);
            this._changeDetector.detectChanges();
        }
        this.render();
    }

    private centerStage() {
        this.canvasContainerDiv.nativeElement.parentElement.scrollLeft = (this.canvasScrollWidth / 2) - (this.canvasWidth / 2);
        this.canvasContainerDiv.nativeElement.parentElement.scrollTop = (this.canvasScrollHeight / 2) - (this.canvasHeight / 2);
    }

    private buildCanvasDisplayObject() : DisplayObject {
        var graphics = new Graphics();
        graphics.beginFill(0xFFFFFF, 1);
        drawRectangle(
            {x: 0, y: 0},
            {x: this.stageWidth, y: this.stageHeight},
            graphics);
        graphics.endFill();
        graphics.lineStyle(1, 0xAAAAAA, 1);
        drawRectangle(
            {x: 0, y: 0},
            {x: this.stageWidth, y: this.stageHeight},
            graphics);
        return graphics;
    }

    private buildCanvasGrid() : DisplayObject {
        var graphics = new Graphics();
        graphics.lineStyle(1, 0xEEEEEE, 1);
        drawGrid(
            {x: 0, y: 0},
            {x: this.stageWidth - 2, y: this.stageHeight - 2},
            {x: this.gridSize, y: this.gridSize},
            graphics);
        return graphics;
    }

    positionFromEvent(event : MouseEvent) : Vector {
        var localPoint = this._stage.toLocal(new Point(event.offsetX, event.offsetY));
        return {
            x: localPoint.x,
            y: localPoint.y
        }
    }

    render() {
        if (this._renderer) {
            this._stage.removeChildren();
            this._stage.addChild(this.canvasDisplayObject);
            this._stage.addChild(this.entitiesDisplayObject);
            this._stage.addChild(this.gridDisplayObject);
            this._renderer.render(this._stage);
        }
    }

    forwardContainingDivEvent(event : MouseEvent) {
        this.canvasRoot.nativeElement.dispatchEvent(new MouseEvent(event.type, event));
    }
}
