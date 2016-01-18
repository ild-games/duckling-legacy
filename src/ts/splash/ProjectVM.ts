
module splashscreen {

    import components = entityframework.components;

    /**
     * View Model that initializes an editor canvas and entity editor for a specific project.
     */
    export class ProjectVM extends framework.ViewModel<framework.Project> {
        get viewFile() : string {
            return "splash/project_vm";
        }

        private childrenAdded : boolean = false;
        private canvas : editorcanvas.CanvasVM = null;

        constructor() {
            super();
            this.registerCallback("undo", this.undo);
            this.registerCallback("redo", this.redo);
            this.registerCallback("save", this.save);
        }

        onDataReady() {
            super.onDataReady();
            this._context.systemLoader = new entityframework.SystemLoader(this.data, new util.JsonLoader());
        }

        onViewReady() {
            super.onViewReady();
            this.addTools();
            $(this.findById("toolSelect")).change(() => {
                this._context.getSharedObject(editorcanvas.services.ToolService).switchTool($(this.findById("toolSelect")).val());
            });
            $('[data-toggle="tooltip"]').tooltip({html: true});

            if (!this.childrenAdded) {
                this.initSharedObjects();
                this.createChildren();
                this._context.systemWindow.makeFullscreen();
            }

            this.childrenAdded = true;
        }

        private addTools() {
            var createEntityTool = new editorcanvas.tools.EntityCreatorTool();
            this.addTool(createEntityTool);

            var selectEntityTool = new editorcanvas.tools.EntitySelectTool();
            this.addTool(selectEntityTool);

            var dragEntityTool = new editorcanvas.tools.EntityDragTool();
            this.addTool(dragEntityTool);

            var mapMoveTool = new editorcanvas.tools.MapDragTool();
            mapMoveTool.draggedElement = this.findById("canvas-view");
            this.addTool(mapMoveTool);

            this._context.getSharedObject(editorcanvas.services.ToolService).curTool = createEntityTool;
        }

        private addTool(tool : editorcanvas.tools.BaseTool) {
            util.jquery.addOptionToSelect($(this.findById("toolSelect")), tool.key, tool.label);
            this._context.getSharedObject(editorcanvas.services.ToolService).registerTool(tool);
        }

        private undo() {
            this._context.commandQueue.undo();
        }

        private redo() {
            this._context.commandQueue.redo();
        }

        private save() {
            this._context.systemLoader.saveMap(this.data.projectName, this.canvas.data);
        }

        private getEmptyEntityFramework() {
            var es = new entityframework.EntitySystem();
            es.addComponentType(new components.PositionComponentFactory());
            es.addComponentType(new components.drawing.DrawableComponentFactory());
            es.addComponentType(new components.CollisionComponentFactory());
            es.addComponentType(new components.CameraComponentFactory());
            return es;
        }

        private initSharedObjects() {
            var selectedEntity = new entityframework.core.SelectedEntity();
            this._context.setSharedObjectByKey("selectedEntity", selectedEntity);
            this._context.setSharedObjectByKey("Project", this.data);
        }

        private createChildren() {
            var ef = this.getEmptyEntityFramework();
            this.canvas = new editorcanvas.CanvasVM();
            this.addChildView("canvas-view-container", this.canvas, ef);
            this.addChildView("entity-editor-container", new entityframework.EntityEditorVM(), ef);
        }
    }
}
