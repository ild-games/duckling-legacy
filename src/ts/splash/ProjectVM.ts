
module splashscreen {

    import components = entityframework.components;

    /**
     * View Model that initializes an editor canvas and entity editor for a specific project.
     */
    export class ProjectVM extends framework.ViewModel<framework.Project> {

        private childrenAdded : boolean = false;

        onViewReady() {
            super.onViewReady();

            if (!this.childrenAdded) {
                this.initSharedObjects();
                this.createChildren();
                this._context.systemWindow.makeFullscreen();
            }

            this.childrenAdded = true;
        }

        get viewFile() : string {
            return "splash/project_vm";
        }

        private getEmptyEntityFramework() {
            var es = new entityframework.EntitySystem();
            es.addComponentType(new components.PhysicsComponentFactory());
            es.addComponentType(new components.drawing.DrawableComponentFactory());
            es.addComponentType(new components.CollisionComponentFactory());
            return es;
        }

        private initSharedObjects() {
            var selectedEntity = new entityframework.core.SelectedEntity();
            this._context.setSharedObjectByKey("selectedEntity", selectedEntity);
            this._context.setSharedObjectByKey("Project", this.data);
        }

        private createChildren() {
            var ef = this.getEmptyEntityFramework();
            this.addChildView("canvas-view-container", new editorcanvas.CanvasVM(), ef);
            this.addChildView("entity-editor-container", new entityframework.EntityEditorVM(), ef);
        }
    }
}