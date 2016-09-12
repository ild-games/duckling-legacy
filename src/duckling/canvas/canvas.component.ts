import {
    Component,
    ElementRef, Input,
    OnChanges,
    OnDestroy,
    AfterViewInit,
    SimpleChange,
    ViewChild,
    ChangeDetectorRef,
    EventEmitter,
    Output
} from '@angular/core';
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

import {Vector} from '../math';
import {isMouseButtonPressed, MouseButton, WindowService} from '../util';

import {ZOOM_LEVELS, DEFAULT_ZOOM_LEVEL} from './_toolbars/canvas-scale.component';
import {drawRectangle} from './drawing/util';
import {BaseTool, ToolService, MapMoveTool, CanvasMouseEvent} from './tools';

/**
 * The Canvas Component is used to render pixijs display objects and wire up Tools.
 */
@Component({
    selector: 'dk-canvas',
    styleUrls: ['./duckling/canvas/canvas.component.css'],
    template: `
        <div #canvasContainerDiv
            class="canvas-container"
            (copy)="onCopy($event)"
            (paste)="onPaste($event)"
            (wheel)="forwardContainingDivWheelEvent($event)"
            (mousedown)="forwardContainingDivMouseEvent($event)"
            (mouseup)="forwardContainingDivMouseEvent($event)"
            (mousemove)="forwardContainingDivMouseEvent($event)"
            (mouseout)="forwardContainingDivMouseEvent($event)">
            <div
                class="canvas-scroll"
                [style.width]="scrollerDimensions.x"
                [style.height]="scrollerDimensions.y">
            </div>
            <canvas
                #canvas
                class="canvas"
                (mousedown)="onMouseDown($event)"
                (mouseup)="onMouseUp($event)"
                (mousemove)="onMouseDrag($event)"
                (mouseout)="onMouseOut()"
                (wheel)="onMouseWheel($event)"
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
    @Input() canvasDisplayObject : DisplayObject;
    @Input() tool : BaseTool;

    @ViewChild('canvas') canvasRoot : ElementRef;
    @ViewChild('canvasContainerDiv') canvasContainerDiv : ElementRef;

    /**
     * Event that is published when a user trys to copy something in the canvas.
     */
    @Output() elementCopy = new EventEmitter<any>();

    /**
     * Event that is published whenever a user trys to paste something in the canvas.
     */
    @Output() elementPaste = new EventEmitter<Vector>();

    /**
     * Event that is published when the scale changes via the canvas (ctrl+scroll)
     */
    @Output() scaleChanged = new EventEmitter<number>();

    /**
     * Event that is published when the tool changes via the canvas (example: holding space
     * uses the map move tool)
     */
    @Output() toolChanged = new EventEmitter<BaseTool>();

    /**
     * The index of the valid ZOOM_LEVELS
     */
    private _zoomLevel = DEFAULT_ZOOM_LEVEL;
    private _mouseLocation : Vector = {x: 0, y: 0};
    private _zoomInCanvasCoords : Vector = null;
    private _renderer : WebGLRenderer | CanvasRenderer;
    private _scrollStageOffset = 32;
    private _viewInited = false;
    private _useToolMoveWithoutMouse = false;
    private _oldToolKey : string = "";

    constructor(private _changeDetector : ChangeDetectorRef,
                private _window : WindowService,
                private _toolService : ToolService) {
    }

    ngAfterViewInit() {
        this._viewInited = true;
        this.setupContainingElementEvents();

        this._renderer = new CanvasRenderer(this.elementDimensions.x, this.elementDimensions.y, {view: this.canvasRoot.nativeElement});
        this._renderer.backgroundColor = 0xDFDFDF;

        this.resizeCanvasElements();
        this.centerStage();
        this.render();
    }

    setupContainingElementEvents() {
        this._window.onResize(() => this.onResize());

        // only elements with tab index set to a positive number receive key events
        this.canvasContainerDiv.nativeElement.parentElement.tabIndex = "1";
        this.canvasContainerDiv.nativeElement.parentElement.onkeydown = (event : KeyboardEvent) => this.onCanvasKeyDown(event);
        this.canvasContainerDiv.nativeElement.parentElement.onkeyup = (event : KeyboardEvent) => this.onCanvasKeyUp(event);

        this.canvasContainerDiv.nativeElement.parentElement.onscroll = () => this.onScroll();
        this.canvasContainerDiv.nativeElement.parentElement.onmousemove = (event : MouseEvent) => event.preventDefault();
        this.canvasContainerDiv.nativeElement.parentElement.onblur = () => this.onBlur();
    }


    ngOnChanges(changes : {stageDimensions?:SimpleChange, scale?:SimpleChange}) {
        if (!this._viewInited) {
            return;
        }

        if (changes.stageDimensions) {
            this.resizeCanvasElements();
            this.centerStage();
        } else if (changes.scale) {
            this.onScaleChanged(changes.scale.previousValue, changes.scale.currentValue);
        }

        this.render();
    }

    onScaleChanged(oldScale : number, newScale : number) {
        let scaleChange = newScale - oldScale;
        let stagePosition = this._stagePosition;
        if (!this._zoomInCanvasCoords) {
            this._zoomInCanvasCoords = {
                x: this.elementDimensions.x / 2,
                y: this.elementDimensions.y / 2
            }
        }

        // to get the zoom in point we need to:
        // 1. convert the canvas element coordinates where we're zooming into
        //    stage coordinates based on old scale.
        // 2. convert the stage coordinate origin from the middle to the top left
        //    so we can match the scrollLeft and scrollTop coordinate system HTML
        //    uses for scroll bars.
        let zoomPoint = {
            x: ((this._zoomInCanvasCoords.x - stagePosition.x) / oldScale) + this.stageDimensions.x / 2,
            y: ((this._zoomInCanvasCoords.y - stagePosition.y) / oldScale) + this.stageDimensions.y / 2
        };

        let offsetPan = {
            x: (zoomPoint.x * scaleChange),
            y: (zoomPoint.y * scaleChange)
        };

        this._zoomInCanvasCoords = null;
        this.resizeCanvasElements();
        this.scrollPan(offsetPan);
    }

    ngOnDestroy() {
        this._renderer.destroy();
        this._window.removeResizeEvent();
        this._window.removeKeyDownEvent();
    }

    onCopy(event : ClipboardEvent) {
        this.elementCopy.emit(null);
    }

    onPaste(event : ClipboardEvent) {
        this.elementPaste.emit(this.stageCoordsFromCanvasCoords(this._mouseLocation));
    }

    onMouseDown(event : MouseEvent) {
        this._window.clearSelection();
        this.canvasContainerDiv.nativeElement.focus();
        if (this.tool) {
            this.tool.onStageDown(this.createCanvasMouseEvent(event));
        }
        event.stopPropagation();
    }

    onMouseUp(event : MouseEvent) {
        if (this.tool) {
            this.tool.onStageUp(this.createCanvasMouseEvent(event));
        }
        event.stopPropagation();
    }

    onMouseDrag(event : MouseEvent) {
        let canvasMouseEvent = this.createCanvasMouseEvent(event);
        let stageCoords = canvasMouseEvent.stageCoords;
        this._mouseLocation = canvasMouseEvent.canvasCoords;
        if (this._isToolMovementActive(event)) {
            this.tool.onStageMove(canvasMouseEvent);
        }
        event.stopPropagation();
    }

    private _isToolMovementActive(event : MouseEvent) : boolean {
        return (
            this.tool &&
            (isMouseButtonPressed(event, MouseButton.Left) || this._useToolMoveWithoutMouse)
        );
    }

    onMouseOut() {
        if (this.tool) {
            this.tool.onLeaveStage();
        }
        event.stopPropagation();
    }

    onMouseWheel(event : WheelEvent) {
        if (event.ctrlKey || event.metaKey) {
            this._zoomInCanvasCoords = {
                x: event.offsetX,
                y: event.offsetY
            };

            this._zoomLevel -= Math.sign(event.deltaY);
            if (this._zoomLevel < 0) {
                this._zoomLevel = 0;
            } else if (this._zoomLevel >= ZOOM_LEVELS.length) {
                this._zoomLevel = ZOOM_LEVELS.length - 1;
            }
            this.scale = ZOOM_LEVELS[this._zoomLevel];
            this.scaleChanged.emit(this.scale);
        }
        event.stopPropagation();
    }

    onBlur() {
        // space bar has tool switching, make sure we undo it if we lose focus
        this._onSpaceKeyUp();
    }

    onCanvasKeyDown(event : KeyboardEvent) {
        const SPACEBAR_KEY = 32;
        if (event.keyCode === SPACEBAR_KEY) {
            this._onSpaceKeyDown();
            event.preventDefault();
        }
    }

    onCanvasKeyUp(event : KeyboardEvent) {
        const SPACEBAR_KEY = 32;
        if (event.keyCode === SPACEBAR_KEY) {
            this._onSpaceKeyUp();
            event.preventDefault();
        }
    }

    private _onSpaceKeyDown() {
        if (this._oldToolKey === "") {
            this._useToolMoveWithoutMouse = true;
            this._oldToolKey = this.tool.key;
            this.tool = this._toolService.getTool("MapMoveTool");
            this.tool.onStageDown({
                canvas: this,
                canvasCoords: this._mouseLocation,
                stageCoords: this.stageCoordsFromCanvasCoords(this._mouseLocation)
            });
            this.toolChanged.emit(this.tool);
        }
    }

    private _onSpaceKeyUp() {
        if (this._oldToolKey !== "") {
            this._useToolMoveWithoutMouse = false;
            this.tool.onStageUp({
                canvas: this,
                canvasCoords: this._mouseLocation,
                stageCoords: this.stageCoordsFromCanvasCoords(this._mouseLocation)
            });
            this.tool = this._toolService.getTool(this._oldToolKey);
            this._oldToolKey = "";
            this.toolChanged.emit(this.tool);
        }
    }

    onResize() {
        this.resizeCanvasElements();
        this.render();
    }

    onScroll() {
        this.render();
    }

    forwardContainingDivMouseEvent(event : MouseEvent) {
        this.canvasRoot.nativeElement.dispatchEvent(new MouseEvent(event.type, event));
    }

    forwardContainingDivWheelEvent(event : WheelEvent) {
        this.canvasRoot.nativeElement.dispatchEvent(new WheelEvent(event.type, event));
    }

    scrollTo(scrollToCoords : Vector) {
        this.canvasContainerDiv.nativeElement.parentElement.scrollLeft = scrollToCoords.x;
        this.canvasContainerDiv.nativeElement.parentElement.scrollTop = scrollToCoords.y;
    }

    scrollPan(scrollPanAmount : Vector) {
        this.canvasContainerDiv.nativeElement.parentElement.scrollLeft += scrollPanAmount.x;
        this.canvasContainerDiv.nativeElement.parentElement.scrollTop += scrollPanAmount.y;
    }

    get scrollPosition() : Vector {
        return {
            x: this.canvasContainerDiv.nativeElement.parentElement.scrollLeft,
            y: this.canvasContainerDiv.nativeElement.parentElement.scrollTop,
        };
    }

    private resizeCanvasElements() {
        this.elementDimensions.x = this.canvasContainerDiv.nativeElement.clientWidth;
        this.elementDimensions.y = this.canvasContainerDiv.nativeElement.clientHeight;
        this.scrollerDimensions.x = this.elementDimensions.x * 2 + (this.stageDimensions.x * this.scale) - (this._scrollStageOffset * 2);
        this.scrollerDimensions.y = this.elementDimensions.y * 2 + (this.stageDimensions.y * this.scale) - (this._scrollStageOffset * 2);
        if (this._renderer) {
            this._renderer.view.style.width = this.elementDimensions.x + "px";
            this._renderer.view.style.height = this.elementDimensions.y + "px";
            this._renderer.resize(this.elementDimensions.x, this.elementDimensions.y);
            this._changeDetector.detectChanges();
        }
    }

    private centerStage() {
        this.scrollTo({
            x: (this.scrollerDimensions.x / 2) - (this.elementDimensions.x / 2),
            y: (this.scrollerDimensions.y / 2) - (this.elementDimensions.y / 2)
        });
    }

    private stageCoordsFromCanvasCoords(canvasCoords : Vector) : Vector {
        var position = this._stagePosition;
        return {
            x: (canvasCoords.x - position.x) / this.scale,
            y: (canvasCoords.y - position.y) / this.scale
        }
    }

    private canvasCoordsFromEvent(event : MouseEvent) : Vector {
        return {
            x: event.offsetX,
            y: event.offsetY
        }
    }

    private render() {
        if (this._renderer) {

            let position = this._stagePosition
            let stage = new Container();

            stage.addChild(this.canvasDisplayObject);
            this.canvasDisplayObject.position.x = position.x + 0.5;
            this.canvasDisplayObject.position.y = position.y + 0.5;
            this.canvasDisplayObject.scale = new Point(this.scale, this.scale);
            this.canvasDisplayObject.updateTransform();

            this._renderer.preserveDrawingBuffer = false;
            this._renderer.render(stage);
        }
    }

    /**
     * Used to reposition the virtual stage when the canvas has been scrolled
     */
    get _stagePosition() {
        let canvasScrollDifferenceWidth = this.scrollerDimensions.x - this.elementDimensions.x;
        let canvasScrollDifferenceHeight = this.scrollerDimensions.y - this.elementDimensions.y;
        return {
            x: (this.elementDimensions.x / 2) + (canvasScrollDifferenceWidth / 2) - this.scrollPosition.x,
            y: (this.elementDimensions.y / 2) + (canvasScrollDifferenceHeight / 2) - this.scrollPosition.y
        }
    }

    private createCanvasMouseEvent(event : MouseEvent) : CanvasMouseEvent {
        let canvasCoords = this.canvasCoordsFromEvent(event);
        return {
            canvasCoords: canvasCoords,
            stageCoords: this.stageCoordsFromCanvasCoords(canvasCoords),
            canvas: this
        }
    }
}
