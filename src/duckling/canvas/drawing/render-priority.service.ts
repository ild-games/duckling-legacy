import { Injectable } from "@angular/core";

import { TaggedEntity, EntitySystem } from "../../entitysystem/entity";
import { DrawnConstruct } from "../../canvas/drawing/drawn-construct";

@Injectable()
export class RenderPriorityService {
    /**
     * Sorts the entity system so the render priorities of the entities drawable attributes are
     * respected.
     * @param  entitySystem EntitySystem to sort for drawing
     * @return Array of entities sorted for drawing
     */
    sortEntities(entitySystem: EntitySystem): Array<TaggedEntity> {
        throw new Error("Not yet implemented");
    }

    sortDrawnConstructs(drawnConstructs: DrawnConstruct[]): DrawnConstruct[][] {
        drawnConstructs.sort(this._sorter);

        let layerDrawnConstructs: DrawnConstruct[][] = [];
        let currentLayer: number = null;
        let nextIndex = -1;
        for (let drawnConstruct of drawnConstructs) {
            if (drawnConstruct.layer !== currentLayer) {
                currentLayer = drawnConstruct.layer;
                nextIndex++;
            }

            if (!layerDrawnConstructs[nextIndex]) {
                layerDrawnConstructs[nextIndex] = [];
            }
            layerDrawnConstructs[nextIndex].push(drawnConstruct);
        }
        return layerDrawnConstructs;
    }

    private _sorter(left: DrawnConstruct, right: DrawnConstruct): number {
        if (left.layer > right.layer) {
            return 1;
        } else if (left.layer < right.layer) {
            return -1;
        }
        return 0;
    }
}
