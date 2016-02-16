import EntityDrawerService from './editorcanvas/services/EntityDrawerService';
import EntitySelectService from './editorcanvas/services/EntitySelectService';
import EntityRenderSortService from './editorcanvas/services/EntityRenderSortService';
import ToolService from './editorcanvas/services/ToolService';
import SelectedEntity from './entitysystem/core/SelectedEntity';
import ResourceManager from './entitysystem/ResourceManager';
import Context from './framework/context/Context';
import {startListener as startErrorListener} from './framework/error/ErrorHandler';
import Project from './framework/project/Project';
import FileDialog from './util/FileDialog';
import SplashScreenVM from './splash/SplashScreenVM';

function main(htmlRoot : HTMLElement, templates : any, window : Window) {
    startErrorListener(window);
    var context = new Context(templates, window);

    context.setSharedObjectByKey("selectedEntity", new SelectedEntity());
    context.setSharedObjectByKey("Project", new Project("", ""));
    context.setSharedObjectByKey("FileDialog", new FileDialog(window));
    context.setSharedObjectByKey("util.resource.ResourceManager", new ResourceManager());
    context.setSharedObjectByKey("editorcanvas.services.EntityDrawerService", new EntityDrawerService(context));
    context.setSharedObjectByKey("editorcanvas.services.EntitySelectService", new EntitySelectService(context));
    context.setSharedObjectByKey("editorcanvas.services.EntityRenderSortService", new EntityRenderSortService(context));
    context.setSharedObjectByKey("editorcanvas.services.ToolService", new ToolService(context));

    (new SplashScreenVM()).init(context, htmlRoot, {});
}
