import {
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChange,
    ViewChild
} from 'angular2/core';
import {Observable} from 'rxjs';
import {autoDetectRenderer, DisplayObject, WebGLRenderer, CanvasRenderer} from 'pixi.js';
import {BaseTool} from './tools/BaseTool';


/**
 * The Canvas Component is used to render pixijs display objects.
 */
@Component({
    selector: 'dk-canvas',
    template: `
        <canvas #canvas [height]="height" [width]="width">
        </canvas>
    `
})
export class Canvas implements OnChanges, OnDestroy {
    @Input() width : number;
    @Input() height : number;
    @Input() stage : DisplayObject;
    @Input() tool : BaseTool;

    private _renderer : WebGLRenderer | CanvasRenderer;

    @ViewChild("canvas") canvasRoot : ElementRef;

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
