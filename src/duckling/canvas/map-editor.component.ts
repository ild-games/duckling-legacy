import {
    Component
} from 'angular2/core';
import {DisplayObject} from 'pixi.js';
import {Observable} from 'rxjs';

import {Canvas} from './canvas.component';
import {EntitySystemService} from '../entitysystem/entity-system.service';
import {EntityDrawerService} from './drawing/entity-drawer.service';

@Component({
    selector: "dk-map-editor",
    directives: [Canvas],
    template: `
        <dk-canvas
            [width]="width"
            [height]="height"
            [stage]="mapStage">
        </dk-canvas>
    `
})
export class MapEditorComponent {
    width : number = 500
    height : number = 400;
    mapStage : DisplayObject;

    constructor(private _entitySystemService : EntitySystemService,
                private _entityDrawerService : EntityDrawerService) {
        this._entitySystemService.entitySystem
            .map(this._entityDrawerService.getSystemMapper())
            .subscribe(stage => this.mapStage = stage);
    }
}
