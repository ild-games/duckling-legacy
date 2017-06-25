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
import {isMouseButtonPressed, MouseButton, WindowService, KeyboardCode} from '../util';
import {OptionsService} from '../state/options.service';

import {ZOOM_LEVELS, DEFAULT_ZOOM_LEVEL} from './_toolbars/canvas-scale.component';
import {drawRectangle} from './drawing/util';
import {BaseTool, ToolService, MapMoveTool, CanvasMouseEvent, CanvasKeyEvent} from './tools';

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
            <canvas
                #canvas
                class="canvas"
                (mousedown)="onMouseDown($event)"
                (mouseup)="onMouseUp($event)"
                (mousemove)="onMouseDrag($event)"
                (mouseout)="onMouseOut()"
                (wheel)="onMouseWheel($event)">
            </canvas>
            <div
                class="canvas-scroll"
                [ngStyle]="scrollerCSS">
            </div>
        </div>
    `
})
export class CanvasComponent implements OnChanges, OnDestroy, AfterViewInit {
    elementDimensions : Vector = {x: 0, y: 0};
    scrollerDimensions : Vector = {x: 0, y: 0};

    @Input() stageDimensions : Vector;
    @Input() gridSize : number;
    @Input() scrollLeft : number = 0;
    @Input() scrollTop : number = 0;
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
     * The index of the valid ZOOM_LEVELS
     */
    private _zoomLevel = DEFAULT_ZOOM_LEVEL;
    private _mouseLocation : Vector = {x: 0, y: 0};
    private _zoomInCanvasCoords : Vector = null;
    private _renderer : WebGLRenderer | CanvasRenderer;
    private _scrollStageOffset = 32;
    private _viewInited = false;

    constructor(private _changeDetector : ChangeDetectorRef,
                private _optionsService : OptionsService,
                private _window : WindowService,
                private _toolService : ToolService) {
    }

    ngAfterViewInit() {
        this._viewInited = true;
        this.setupContainingElementEvents();

        if (this._optionsService.getSetting("useWebGL", true)) {
            this._renderer = new WebGLRenderer(
                this.elementDimensions.x,
                this.elementDimensions.y,
                {view: this.canvasRoot.nativeElement});
        } else {
            this._renderer = new CanvasRenderer(
                this.elementDimensions.x,
                this.elementDimensions.y,
                {view: this.canvasRoot.nativeElement});
        }
        this._renderer.backgroundColor = 0xDFDFDF;

        this._resizeCanvasElements();
        if (this.scrollTop === 0 && this.scrollLeft === 0) {
            this._centerStage();
        } else {
            this.scrollTo({x: this.scrollLeft, y: this.scrollTop});
        }
        this._render();
    }

    setupContainingElementEvents() {
        this._window.onResize(() => this.onResize());

        this.canvasContainerDiv.nativeElement.parentElement.tabIndex = "1";

        this.canvasContainerDiv.nativeElement.parentElement.onwheel = (event : WheelEvent) => this.onScroll(event);
        this.canvasContainerDiv.nativeElement.parentElement.onmousemove = (event : MouseEvent) => event.preventDefault();
        this.canvasContainerDiv.nativeElement.parentElement.onkeyup = (event : KeyboardEvent) => this.onKeyUp(event);
        this.canvasContainerDiv.nativeElement.parentElement.onkeydown = (event : KeyboardEvent) => this.onKeyDown(event);
    }

    ngOnChanges(changes : {stageDimensions?:SimpleChange, scale?:SimpleChange}) {
        if (!this._viewInited) {
            return;
        }

        if (changes.stageDimensions) {
            this._resizeCanvasElements();
            this._centerStage();
        } else if (changes.scale) {
            this.onScaleChanged(changes.scale.previousValue, changes.scale.currentValue);
        }

        this._render();
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
        this._resizeCanvasElements();
        this.scrollPan(offsetPan);
    }

    ngOnDestroy() {
        this._renderer.destroy();
        this._window.removeResizeEvent();
    }

    onCopy(event : ClipboardEvent) {
        this.elementCopy.emit(null);
    }

    onPaste(event : ClipboardEvent) {
        this.elementPaste.emit(this._stageCoordsFromCanvasCoords(this._mouseLocation));
    }

    onKeyDown(event : KeyboardEvent) {
        if (this._isPreventedKey(event.keyCode)) {
            event.preventDefault();
        }
        if (this.tool) {
            this.tool.onKeyDown(this._createCanvasKeyEvent(event));
        }
    }

    onKeyUp(event : KeyboardEvent) {
        if (this.tool) {
            this.tool.onKeyUp(this._createCanvasKeyEvent(event));
        }
    }

    onMouseDown(event : MouseEvent) {
        event.stopPropagation();
        this._window.clearSelection();
        this.canvasContainerDiv.nativeElement.focus();
        if (this.tool) {
            this.tool.onStageDown(this._createCanvasMouseEvent(event));
        }
    }

    onMouseUp(event : MouseEvent) {
        event.stopPropagation();
        if (this.tool) {
            this.tool.onStageUp(this._createCanvasMouseEvent(event));
        }
    }

    onMouseDrag(event : MouseEvent) {
        event.stopPropagation();
        let canvasMouseEvent = this._createCanvasMouseEvent(event);
        let stageCoords = canvasMouseEvent.stageCoords;
        this._mouseLocation = canvasMouseEvent.canvasCoords;
        if (this.tool && isMouseButtonPressed(event, MouseButton.Left)) {
            this.tool.onStageMove(canvasMouseEvent);
        }
    }

    onMouseOut() {
        event.stopPropagation();
        if (this.tool) {
            this.tool.onLeaveStage();
        }
    }

    onMouseWheel(event : WheelEvent) {
        event.stopPropagation();
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
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
    }

    onResize() {
        this._resizeCanvasElements();
        this._render();
    }

    onScroll(event : WheelEvent) {
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
        }
        this._render();
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

    private _resizeCanvasElements() {
        this.elementDimensions.x = this.canvasContainerDiv.nativeElement.parentElement.offsetWidth;
        this.elementDimensions.y = this.canvasContainerDiv.nativeElement.parentElement.offsetHeight;
        this.scrollerDimensions.x = this.elementDimensions.x * 2 + (this.stageDimensions.x * this.scale) - (this._scrollStageOffset * 2);
        this.scrollerDimensions.y = this.elementDimensions.y * 2 + (this.stageDimensions.y * this.scale) - (this._scrollStageOffset * 2);
        if (this._renderer) {
            this._renderer.view.style.width = this.elementDimensions.x + "px";
            this._renderer.view.style.height = this.elementDimensions.y + "px";
            this._renderer.resize(this.elementDimensions.x, this.elementDimensions.y);
            this._changeDetector.detectChanges();
        }
    }

    private _centerStage() {
        this.scrollTo({
            x: (this.scrollerDimensions.x / 2) - (this.elementDimensions.x / 2),
            y: (this.scrollerDimensions.y / 2) - (this.elementDimensions.y / 2)
        });
    }

    private _stageCoordsFromCanvasCoords(canvasCoords : Vector) : Vector {
        let position = this._stagePosition;
        return {
            x: ((canvasCoords.x - position.x) / this.scale) + this.stageDimensions.x / 2,
            y: ((canvasCoords.y - position.y) / this.scale) + this.stageDimensions.y / 2
        }
    }

    private _canvasCoordsFromEvent(event : MouseEvent) : Vector {
        return {
            x: event.offsetX,
            y: event.offsetY
        }
    }

    private _render() {
        if (this._renderer) {

            let position = this._stagePosition
            let stage = new Container();

            stage.addChild(this.canvasDisplayObject);
            this.canvasDisplayObject.position.x = position.x + 0.5 - ((this.stageDimensions.x * this.scale) / 2);
            this.canvasDisplayObject.position.y = position.y + 0.5 - ((this.stageDimensions.y * this.scale) / 2);
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

    private _createCanvasMouseEvent(event : MouseEvent) : CanvasMouseEvent {
        let canvasCoords = this._canvasCoordsFromEvent(event);
        return {
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            canvasCoords: canvasCoords,
            stageCoords: this._stageCoordsFromCanvasCoords(canvasCoords),
            canvas: this
        }
    }

    private _createCanvasKeyEvent(event : KeyboardEvent) : CanvasKeyEvent {
        let canvasCoords = this._mouseLocation;
        return {
            keyCode: event.keyCode,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            canvasCoords: canvasCoords,
            stageCoords: this._stageCoordsFromCanvasCoords(canvasCoords),
            canvas: this
        }
    }

    private _isPreventedKey(keyCode : number) {
        return (
            keyCode === KeyboardCode.SPACEBAR ||
            keyCode === KeyboardCode.UP ||
            keyCode === KeyboardCode.RIGHT ||
            keyCode === KeyboardCode.DOWN ||
            keyCode === KeyboardCode.LEFT
        );
    }

    get scrollerCSS() : any {
        return {
            'width': `${this.scrollerDimensions.x}px`,
            'height': `${this.scrollerDimensions.y}px`
        };
    }
}
