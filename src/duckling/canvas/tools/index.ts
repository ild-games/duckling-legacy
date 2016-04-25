export * from './base-tool';
export * from './entity-creator-tool';
export * from './entity-move-tool';

import {EntityCreatorTool} from './entity-creator-tool';
import {EntityMoveTool} from './entity-move-tool';

export const TOOL_PROVIDERS = [
    EntityCreatorTool,
    EntityMoveTool
]
