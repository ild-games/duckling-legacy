import {
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    AfterViewInit,
    SimpleChange,
    ViewChild,
    ChangeDetectorRef
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
                (mousedown)="onMouseDown($event)"
                (mouseup)="onMouseUp($event)"
                (mousemove)="onMouseDrag($event)"
                (mouseout)="onMouseOut()"
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

    private _renderer : WebGLRenderer | CanvasRenderer;


    constructor(private _changeDetector : ChangeDetectorRef,
                private _window : WindowService) {
        this._window.on('resize', (event : any) => this.onResize(event));
    }

    ngAfterViewInit() {
        this._renderer = new CanvasRenderer(this.width, this.height, {view: this.canvasRoot.nativeElement});
        this.render();
    }

    ngOnChanges(changes : {stage?:SimpleChange, width?:SimpleChange, height?:SimpleChange}) {
        this.render();
    }

    ngOnDestroy() {
        this._renderer.destroy();
    }

    onMouseDown(event : MouseEvent) {
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
        if (this.tool && isMouseButtonPressed(event, MouseButton.Left)) {
            this.tool.onStageMove(this.positionFromEvent(event));
        }
    }

    onMouseOut() {
        if (this.tool) {
            this.tool.onLeaveStage();
        }
    }

    onResize(event : any) {
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

    positionFromEvent(event : MouseEvent) : Vector {
        return {
            x: event.offsetX,
            y: event.offsetY
        }
    }

    render() {
        if (this.stage && this._renderer) {
            this._renderer.render(this.stage);
        }
    }
}
