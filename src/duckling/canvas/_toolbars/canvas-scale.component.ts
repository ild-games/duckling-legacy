import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

export const ZOOM_LEVELS = [0.10, 0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5];
export const DEFAULT_ZOOM_LEVEL = ZOOM_LEVELS.indexOf(1);

/**
 * Component for managing the bottom bar controls for the map editor
 */
@Component({
    selector: "dk-canvas-scale",
    styleUrls: ['./duckling/canvas/_toolbars/canvas-scale.component.css'],
    template: `
        <dk-toolbar-button
            icon="minus"
            tooltip="Zoom out"
            (click)="onZoomOut()">
        </dk-toolbar-button>
        <span class="scale-label">
            {{(scale * 100).toFixed(0) + "%"}}
        </span>
        <dk-toolbar-button
            icon="plus"
            tooltip="Zoom in"
            (click)="onZoomIn()">
        </dk-toolbar-button>
    `
})
export class CanvasScaleComponent {
    @Input() scale : number;

    @Output() scaleChanged = new EventEmitter<number>();

    onZoomOut() {
        let curZoomLevel = ZOOM_LEVELS.indexOf(this.scale);
        curZoomLevel--;
        if (curZoomLevel < 0) {
            curZoomLevel = 0;
        }
        this.scale = ZOOM_LEVELS[curZoomLevel];
        this.scaleChanged.emit(this.scale);
    }

    onZoomIn() {
        let curZoomLevel = ZOOM_LEVELS.indexOf(this.scale);
        curZoomLevel++;
        if (curZoomLevel === ZOOM_LEVELS.length) {
            curZoomLevel = ZOOM_LEVELS.length - 1;
        }
        this.scale = ZOOM_LEVELS[curZoomLevel];
        this.scaleChanged.emit(this.scale);
    }
}
