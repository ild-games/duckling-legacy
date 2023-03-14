import { immutableAssign } from "../../util";

import { Drawable, DrawableType, defaultDrawable } from "./drawable";
import { SFMLText } from "./sfml-text";

export interface TextDrawable extends Drawable {
    text: SFMLText;
}

export let defaultTextDrawable: TextDrawable = immutableAssign(
    defaultDrawable as TextDrawable,
    {
        __cpp_type: "ild::TextDrawable",
        key: "TextDrawable",
        text: {
            text: "Example",
            characterSize: 20,
            fontKey: "",
            color: {
                r: 0,
                g: 0,
                b: 0,
                a: 255,
            },
        },
    }
);
