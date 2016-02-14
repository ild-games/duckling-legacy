import ViewModel from '../framework/ViewModel';
import {onPromiseError} from '../framework/error/ErrorHandler';
import Project from '../framework/project/Project';
import FileDialog from '../util/FileDialog';
import {JsonLoader} from '../util/JsonLoader';
import * as path from '../util/Path';
import ProjectVM from './ProjectVM';

interface ProjectModel {
    title : string,
    path : string
}

var gui = require("nw.gui");

/**
 * ViewModel used to render the splash screen.
 */
export default class SplashScreenVM extends ViewModel<any> {
    private version = "0.0.1";
    private fileDialog : FileDialog;
    private jsonLoader : JsonLoader = new JsonLoader();
    private projects : ProjectModel[] = [];


    onDataReady() {
        super.onDataReady();

        this.registerCallback("open", this.openProject);
        this.registerCallback("new-project", this.newProject);

        this.fileDialog = this._context.getSharedObjectByKey("FileDialog");
        this.loadProject();
    }

    onViewReady() {
        super.onViewReady();

        this._context.systemWindow.setFixedSize(945, 645);
        this._context.systemWindow.center();
    }

    loadProject() {
        this.jsonLoader.getJsonFromPath(this.projectListPath).then((json) => {
            if (json) {
                this.projects = JSON.parse(json);
            } else {
                this.projects = [];
            }
        },(error) => {
            this.projects = [];
        });
    }

    saveProjects() {
        this.jsonLoader.saveJsonToPath(this.projectListPath, JSON.stringify(this.projects));
    }

    get projectListPath() {
        return path.join(path.home(),".duckling","recent_projects.json");
    }

    get viewFile() : string {
        return "splash/splash_vm";
    }

    get rootCSSClass() : string {
        return "splash-screen";
    }

    newProject(event) {
        this.fileDialog.getDirName().then((dirName : string) => {
            this.openProject(event, {
                path : dirName,
                title : path.basename(dirName)
            });
        }, onPromiseError(this._context));
    }

    private reorderProject(openedProject) {
        this.projects = this.projects.filter((project) => project.path !== openedProject.path);
        this.projects = ([openedProject].concat(this.projects)).slice(0,8);
    }

    private openProject(event, project : ProjectModel) {
        this._context.systemWindow.clearFixedSize();
        var projectModel = new Project(project.title, project.path);
        var projectVM = new ProjectVM();
        this.replaceWithView(projectVM, projectModel);

        this.reorderProject(project);
        this.saveProjects();
    }
}
