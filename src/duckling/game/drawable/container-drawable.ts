import {Drawable, DrawableType} from './drawable';

export interface ContainerDrawable extends Drawable {

}

export var defaultContainerDrawable : ContainerDrawable = {
    type: DrawableType.Container,
    renderPriority: 0,
    scale: {
        x: 1,
        y: 1
    },
    rotation: 0,
    bounds: {
        x: 0,
        y: 0
    }
}
