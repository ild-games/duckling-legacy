module editorcanvas.services {

    /**
     * Manages the tools in a given context.
     */
    @framework.ContextKey("editorcanvas.services.ToolService")
    export class ToolService {
        /**
         * Current tool selected.
         */
        curTool : editorcanvas.tools.Tool;

        private tools : { [key : string] : editorcanvas.tools.BaseTool } = {};
        private context : framework.Context;

        constructor(context : framework.Context) {
            this.context = context;
        }

        /**
         * Registers a tool that can be used by the context.
         *
         * @param tool Tool to be registered.
         */
        registerTool(tool : editorcanvas.tools.BaseTool) {
            this.tools[tool.key] = tool;
            tool.onBind(this.context);
        }

        /**
         * Switches the current tool to the given tool based on the tool's name.
         *
         * @param toolName Name of the tool to switch to.
         */
        switchTool(toolName : string) {
            this.curTool = this.tools[toolName];
        }
    }
}
