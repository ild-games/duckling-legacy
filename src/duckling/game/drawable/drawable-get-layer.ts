import { DrawableAttribute } from "./drawable-attribute";
import { Vector } from "../../math";
import { immutableAssign } from "../../util";

export function getDrawableLayer(attribute: DrawableAttribute): string {
    if (!attribute || !attribute.topDrawable) {
        return "";
    }

    return "" + attribute.topDrawable.renderPriority;
}
