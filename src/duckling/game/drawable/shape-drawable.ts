import { immutableAssign } from '../../util';
import { Circle } from './circle';

import { Drawable, DrawableType, defaultDrawable } from './drawable';
import { Rectangle } from './rectangle';
import { Shape } from './shape';

export interface ShapeDrawable extends Drawable {
  shape: Shape;
}

export function asCircle(shape: Shape): Circle {
  return shape as Circle;
}
export function asRect(shape: Shape): Rectangle {
  return shape as Rectangle;
}

export let defaultShapeDrawable: ShapeDrawable = immutableAssign(
  defaultDrawable as ShapeDrawable,
  {
    __cpp_type: 'ild::ShapeDrawable',
    key: 'ShapeDrawable',
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
