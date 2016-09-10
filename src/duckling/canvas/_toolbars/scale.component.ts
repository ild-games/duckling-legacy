import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

export let zoomLevels = [0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5];

import {ToolbarButton} from '../../controls';

/**
 * Component for managing the bottom bar controls for the map editor
 */
@Component({
    selector: "dk-scale",
    directives: [ToolbarButton],
    styleUrls: ['./duckling/canvas/_toolbars/scale.component.css'],
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
export class ScaleComponent {
    @Input() scale : number;

    @Output() scaleChanged = new EventEmitter<number>();

    onZoomOut() {
        let curZoomLevel = zoomLevels.indexOf(this.scale);
        curZoomLevel--;
        if (curZoomLevel < 0) {
            curZoomLevel = 0;
        }
        this.scale = zoomLevels[curZoomLevel];
        this.scaleChanged.emit(this.scale);
    }

    onZoomIn() {
        let curZoomLevel = zoomLevels.indexOf(this.scale);
        curZoomLevel++;
        if (curZoomLevel === zoomLevels.length) {
            curZoomLevel = zoomLevels.length - 1;
        }
        this.scale = zoomLevels[curZoomLevel];
        this.scaleChanged.emit(this.scale);
    }
}
