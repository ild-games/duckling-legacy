import { Injectable } from "@angular/core";

import { ToolbarOption } from "../../controls";
import { EntityCreatorTool, BaseTool, MapMoveTool } from "../tools";
import { SelectedEntityTool } from "./selected-entity-tool";

/**
 * Provide access to tools for the canvas.
 */
@Injectable()
export class ToolService {
  private _tools: { [key: string]: BaseTool } = {};
  private _default: BaseTool;

  constructor(
    entityCreator: EntityCreatorTool,
    selectedEntityTool: SelectedEntityTool,
    mapMoveTool: MapMoveTool
  ) {
    this._default = selectedEntityTool;
    this.addTool(entityCreator);
    this.addTool(selectedEntityTool);
    this.addTool(mapMoveTool);
  }

  /**
   * The default tool.
   */
  get defaultTool(): BaseTool {
    return this._default;
  }

  /**
   * Get the select options for the available tools.
   */
  get toolOptions(): ToolbarOption[] {
    let options: ToolbarOption[] = [];
    for (let toolKey in this._tools) {
      options.push({
        value: toolKey,
        title: this._tools[toolKey].label,
        icon: this._tools[toolKey].icon
      });
    }
    return options;
  }

  /**
   * Get the tool corresponding to the given key.
   * @param  key Key of the tool that should be retrieved.
   * @return A tool instance.
   */
  getTool<T extends BaseTool>(key: string): T {
    return <T>this._tools[key];
  }

  /**
   * Add a tool to the storage in the system.
   * @param  baseTool Tool to add to the service.
   */
  addTool(baseTool: BaseTool) {
    this._tools[baseTool.key] = baseTool;
  }
}
