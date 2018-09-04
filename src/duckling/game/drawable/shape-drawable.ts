import { immutableAssign } from "../../util";

import { Drawable, DrawableType, defaultDrawable } from "./drawable";
import { Shape } from "./shape";

export interface ShapeDrawable extends Drawable {
    shape: Shape;
}

export let defaultShapeDrawable: ShapeDrawable = immutableAssign(
    defaultDrawable as ShapeDrawable,
    {
        __cpp_type: "ild::ShapeDrawable",
        key: "ShapeDrawable",
        shape: {
            __cpp_type: null,
            fillColor: {
                r: 0,
                g: 0,
                b: 0,
                a: 255,
            },
            type: null,
        },
    }
);
