import CanvasVM from '../editorcanvas/CanvasVM';
import EntityCreatorTool from '../editorcanvas/tools/EntityCreatorTool';
import EntityDragTool from '../editorcanvas/tools/EntityDragTool';
import EntitySelectTool from '../editorcanvas/tools/EntitySelectTool';
import MapDragTool from '../editorcanvas/tools/MapDragTool';
import Tool from '../editorcanvas/tools/Tool';
import ToolService from '../editorcanvas/services/ToolService';
import {DrawableComponentFactory} from '../entitysystem/components/drawing/DrawableComponent';
import {PositionComponentFactory} from '../entitysystem/components/PositionComponent';
import {CollisionComponentFactory} from '../entitysystem/components/CollisionComponent';
import {CameraComponentFactory} from '../entitysystem/components/CameraComponent';
import {EntitySystem} from '../entitysystem/core/EntitySystem';
import SelectedEntity from '../entitysystem/core/SelectedEntity';
import SystemLoader from '../entitysystem/core/SystemLoader';
import {EntityEditorVM} from '../entitysystem/entityeditor/EntityEditorVM';
import Project from '../framework/project/Project';
import ViewModel from '../framework/ViewModel';
import {JsonLoader} from '../util/JsonLoader';
import {addOptionToSelect} from '../util/JQueryUtils';

/**
 * View Model that initializes an editor canvas and entity editor for a specific project.
 */
export default class ProjectVM extends ViewModel<Project> {
    get viewFile() : string {
        return "splash/project_vm";
    }

    private childrenAdded : boolean = false;
    private canvas : CanvasVM = null;
    private systemLoader : SystemLoader;

    constructor() {
        super();
        this.registerCallback("undo", this.undo);
        this.registerCallback("redo", this.redo);
        this.registerCallback("save", this.save);
    }

    onDataReady() {
        super.onDataReady();
        this.systemLoader = new SystemLoader(this.data, new JsonLoader());
        this._context.setSharedObjectByKey('entityframework.SystemLoader', this.systemLoader);
    }

    onViewReady() {
        super.onViewReady();
        $(this.findById("toolSelect")).change(() => {
            this._context.getSharedObject(ToolService).switchTool($(this.findById("toolSelect")).val());
        });
        $('[data-toggle="tooltip"]').tooltip({html: true});

        if (!this.childrenAdded) {
            this.initSharedObjects();
            this.createChildren();
            this._context.systemWindow.makeFullscreen();
        }
        this.childrenAdded = true;

        this.addTools();
    }

    private addTools() {
        var createEntityTool = new EntityCreatorTool();
        this.addTool(createEntityTool);

        var selectEntityTool = new EntitySelectTool();
        this.addTool(selectEntityTool);

        var dragEntityTool = new EntityDragTool();
        this.addTool(dragEntityTool);

        var mapMoveTool = new MapDragTool();
        mapMoveTool.draggedElement = this.canvas.findById("canvas-view");
        this.addTool(mapMoveTool);

        this._context.getSharedObject(ToolService).currentTool = createEntityTool;
    }

    private addTool(tool : Tool) {
        addOptionToSelect($(this.findById("toolSelect")), tool.key, tool.label);
        this._context.getSharedObject(ToolService).registerTool(tool);
    }

    private undo() {
        this._context.commandQueue.undo();
    }

    private redo() {
        this._context.commandQueue.redo();
    }

    private save() {
        this.systemLoader.saveMap(this.data.projectName, this.canvas.data);
    }

    private getEmptyEntityFramework() {
        var es = new EntitySystem();
        es.addComponentType(new PositionComponentFactory());
        es.addComponentType(new DrawableComponentFactory());
        es.addComponentType(new CollisionComponentFactory());
        es.addComponentType(new CameraComponentFactory());
        return es;
    }

    private initSharedObjects() {
        var selectedEntity = new SelectedEntity();
        this._context.setSharedObjectByKey("selectedEntity", selectedEntity);
        this._context.setSharedObjectByKey("Project", this.data);
    }

    private createChildren() {
        var ef = this.getEmptyEntityFramework();
        this.canvas = new CanvasVM();
        this.addChildView("canvas-view-container", this.canvas, ef);
        this.addChildView("entity-editor-container", new EntityEditorVM(), ef);
    }
}
