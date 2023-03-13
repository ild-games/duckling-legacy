import { immutableAssign } from "../../util";

import { Drawable, DrawableType, defaultDrawable } from "./drawable";

export interface ContainerDrawable extends Drawable {
    drawables: Drawable[];
}

export let defaultContainerDrawable: ContainerDrawable = immutableAssign(
    defaultDrawable as ContainerDrawable,
    {
        __cpp_type: "ild::ContainerDrawable",
        key: "ContainerDrawable",
        drawables: [],
    }
);
