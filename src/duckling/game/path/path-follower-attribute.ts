import { Attribute, Entity } from "../../entitysystem/entity";
import { Vector } from "../../math/vector";

export const PATH_FOLLOWER_KEY = "pathFollower";

export interface PathFollowerAttribute extends Attribute {
    pathEntity: string;
}

export let defaultPathFollower: PathFollowerAttribute = {
    pathEntity: "",
};
