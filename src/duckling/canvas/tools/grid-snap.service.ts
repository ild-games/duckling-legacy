import {Injectable} from '@angular/core';

import {Box2} from '../../math/box2'
import {Vector, vectorAdd} from '../../math/vector';
import {ProjectService} from '../../project/project.service';

import {CanvasMouseEvent} from './base-tool';
import {snapPosition, minCornerSnapDistance} from './_grid-snap';

@Injectable()
export class SnapToGridService {
    constructor(private _project : ProjectService) {
    }

    snapPosition(position : Vector) : Vector {
        return snapPosition(position, this._grid);
    }

    snapBox(position: Vector, box : Box2)  : Vector {
        return vectorAdd(position, minCornerSnapDistance(position, box, this._grid));
    }

    isSnapToGrid(event : CanvasMouseEvent) {
        return !event.shiftKey;
    }

    get _grid() {
        let size = this._project.project.getValue().currentMap.gridSize;
        return {x: size, y: size};
    }
}
