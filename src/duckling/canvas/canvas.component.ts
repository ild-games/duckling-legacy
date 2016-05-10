import {
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    AfterViewInit,
    SimpleChange,
    ViewChild
} from 'angular2/core';
import {Observable} from 'rxjs';
import {autoDetectRenderer, DisplayObject, WebGLRenderer, CanvasRenderer} from 'pixi.js';
import {BaseTool} from './tools/base-tool';
import {Vector} from '../math';
import {isMouseButtonPressed, MouseButton} from '../util';

/**
 * The Canvas Component is used to render pixijs display objects and wire up Tools.
 */
@Component({
    selector: 'dk-canvas',
    template: `
        <canvas
            #canvas
            (mousedown)="onMouseDown($event)"
            (mouseup)="onMouseUp($event)"
            (mousemove)="onMouseDrag($event)"
            (mouseout)="onMouseOut()"
            [height]="height"
            [width]="width">
        </canvas>
    `
})
export class Canvas implements OnChanges, OnDestroy, AfterViewInit {
    @Input() width : number;
    @Input() height : number;
    @Input() stage : DisplayObject;
    @Input() tool : BaseTool;

    private _renderer : WebGLRenderer | CanvasRenderer;

    @ViewChild("canvas") canvasRoot : ElementRef;

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

    positionFromEvent(event : MouseEvent) : Vector {
        return {
            x: event.offsetX,
            y: event.offsetY
        }
    }

    ngAfterViewInit() {
        this._renderer = new CanvasRenderer(this.width, this.height, {view: this.canvasRoot.nativeElement});
        this.render();
    }

    render() {
        if (this.stage && this._renderer) {
            this._renderer.render(this.stage);
        }
    }

    ngOnChanges(changes : {stage?:SimpleChange, width?:SimpleChange, height?:SimpleChange}) {
        if ((changes.width || changes.height) && this._renderer) {
            this._renderer.resize(this.width, this.height);
        }

        this.render();
    }

    ngOnDestroy() {
        this._renderer.destroy();
    }
}
