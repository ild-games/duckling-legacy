import ContextKey from '../../framework/context/ContextKey';
import Context from '../../framework/context/Context';
import Tool from '../tools/Tool';

/**
* Manages the tools in a given context.
*/
@ContextKey("editorcanvas.services.ToolService")
export default class ToolService {
    /**
    * Current tool selected.
    */
    currentTool : Tool;

    private tools : { [key : string] : Tool } = {};
    private context : Context;

    constructor(context : Context) {
        this.context = context;
    }

    /**
    * Registers a tool that can be used by the context.
    *
    * @param tool Tool to be registered.
    */
    registerTool(tool : Tool) {
        this.tools[tool.key] = tool;
        tool.onBind(this.context);
    }

    /**
    * Switches the current tool to the given tool based on the tool's name.
    *
    * @param toolName Name of the tool to switch to.
    */
    switchTool(toolName : string) {
        this.currentTool = this.tools[toolName];
    }
}
