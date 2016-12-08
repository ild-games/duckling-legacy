import {Injectable} from '@angular/core';

import {Vector} from '../math/vector';

/**
 * Service that holds the dimension and grid information for the active map
 */
@Injectable()
export class MapDimensionService {
    /**
     * Width and height of active map
     */
    dimension : Vector;
    /**
     * Grid size of the active map
     */
    gridSize : number;

    constructor() {
        this.dimension = {x: 1200, y: 800};
        this.gridSize = 16;
    }
}