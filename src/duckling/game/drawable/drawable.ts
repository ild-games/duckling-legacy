import { Vector } from "../../math";
import { immutableAssign } from "../../util";

export enum DrawableType {
  Shape,
  Container,
  Image,
  Animated,
  Text,
  TileBlock
}

export interface Drawable {
  __cpp_type: string;
  key: string;
  renderPriority: number;
  scale: Vector;
  rotation: number;
  inactive: boolean;
  anchor: Vector;
  priorityOffset: number;
}

export let defaultDrawable: Drawable = {
  __cpp_type: null,
  key: "topDrawable",
  inactive: false,
  renderPriority: 0,
  scale: {
    x: 1,
    y: 1
  },
  rotation: 0,
  anchor: {
    x: 0,
    y: 0
  },
  priorityOffset: 0
};
