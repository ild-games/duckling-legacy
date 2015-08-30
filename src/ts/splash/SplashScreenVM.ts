
module splashscreen {

    interface ProjectModel {
        title : string,
        path : string
    }

    var gui = require("nw.gui");

    /**
     * ViewModel used to render the splash screen.
     */
    export class SplashScreenVM extends framework.ViewModel<any> {
        private version = "0.0.1";
        private fileDialog : util.FileDialog;
        private jsonLoader : util.JsonLoader = new util.JsonLoader();
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
                this.projects = JSON.parse(json);
            },(error) => {
                this.projects = [];
            });
        }

        saveProjects() {
            this.jsonLoader.saveJsonToPath(this.projectListPath, JSON.stringify(this.projects));
        }

        get projectListPath() {
            return util.path.join(util.path.home(),".duckling","recent_projects.json");
        }


        get viewFile():string {
            return "splash/splash_vm";
        }

        newProject(event) {
            this.fileDialog.getDirName().then((dirName : string) => {
                this.openProject(event, {
                    path : dirName,
                    title : util.path.basename(dirName)
                });
            });
        }

        private reorderProject(openedProject) {
            this.projects = this.projects.filter((project) => project.path !== openedProject.path);
            this.projects = ([openedProject].concat(this.projects)).slice(0,8);
        }

        private openProject(event, project : ProjectModel) {
            this._context.systemWindow.clearFixedSize();
            var projectModel = new framework.Project(project.path);
            var projectVM = new ProjectVM();
            this.replaceWithView(projectVM, projectModel);

            this.reorderProject(project);
            this.saveProjects();
        }
    }
}