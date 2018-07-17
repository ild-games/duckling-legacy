import { Vector, vectorSubtract, vectorAdd } from "../../math/vector";
import { Box2 } from "../../math/box2";

export function resize(
  beforeDrag: Box2,
  afterDrag: Box2,
  boxToResize: Box2,
  positionOffset: Vector
): Box2 {
  let nextSize = {
    x: _calculateSize(
      boxToResize.dimension.x,
      beforeDrag.dimension.x,
      afterDrag.dimension.x
    ),
    y: _calculateSize(
      boxToResize.dimension.y,
      beforeDrag.dimension.y,
      afterDrag.dimension.y
    )
  };

  return {
    dimension: nextSize,
    position: vectorSubtract(
      resizePoint(beforeDrag, afterDrag, boxToResize.position),
      positionOffset
    ),
    rotation: boxToResize.rotation
  };
}

export function resizePoint(beforeDrag: Box2, afterDrag: Box2, point: Vector) {
  let positionDiff = vectorSubtract(point, beforeDrag.position);
  return {
    x:
      afterDrag.position.x +
      (positionDiff.x * afterDrag.dimension.x) / beforeDrag.dimension.x,
    y:
      afterDrag.position.y +
      (positionDiff.y * afterDrag.dimension.y) / beforeDrag.dimension.y
  };
}

function _calculateSize(
  valueToResize: number,
  boxBefore: number,
  boxAfter: number
) {
  return (valueToResize * boxAfter) / boxBefore;
}
