import {
    OnInit,
    Component,
    Output,
    EventEmitter
} from '@angular/core';

import {ProjectSerializerService} from './_project-serializer.service';
import {PathService} from '../util/path.service';
import {DialogService} from '../util/dialog.service';
import {WindowService} from '../util/window.service';
import {Icon} from '../controls';

interface ProjectModel {
    title : string,
    path : string
}

/**
 * Specifies the number of projects can be displayed on the splash screen.
 */
const MAX_SPLASH_ENTRIES : number = 7;

/**
 * The splash screen component allows the user to select a project they wish to edit.
 */
@Component({
    selector: 'dk-splash-screen',
    styleUrls: [ './duckling/splash/splash.component.css' ],
    template: `
        <div class="splash-screen">
            <div class="left-section">
                <md-nav-list>
                    <md-list-item
                    md-list-item
                    *ngFor="let project of _projects"
                    (click)="openProject({title: project.title, path: project.path})">
                        <p md-line class="project-title"> {{project.title}} </p>
                        <p md-line class="project-path"> {{project.path}} </p>
                    </md-list-item>
                </md-nav-list>

                <div class="actions">
                    <a (click)="onNewProjectClick($event)">
                        <dk-icon iconClass="file-o">
                        </dk-icon>
                        New
                    </a>
                </div>
            </div>

            <div class="right-section">
                <div class="duckling-title">
                    <div class="duckling-name">
                        Duckling
                    </div>
                    <div class="duckling-version">
                        {{_version}}
                    </div>
                </div>
            </div>

            <div class="the-duck"></div>
        </div>
    `
})
export class SplashComponent implements OnInit {
    private _version : string = "0.0.1";
    private _projects : ProjectModel[] = [];
    private _dialogOptions : {};

    /**
     * EventEmitter that will be invoked when a project is selected.
     */
    @Output() projectOpened = new EventEmitter<string>();

    constructor(private _path : PathService,
                private _window : WindowService,
                private _dialog : DialogService,
                private _projectSerializer : ProjectSerializerService) {
        this._dialogOptions = {
            defaultPath: this._path.home(),
            properties: [
                'openDirectory',
                'createDirectory'
            ]
        };
    }

    ngOnInit() {
        this.resizeAndCenterWindow();
        this.loadProjects();
    }

    /**
     * Loads the recently used project list.
     */
    loadProjects() {
        this._projectSerializer.loadProjects(this.projectListFile).then((projects) => {
            this._projects = projects;
        });
    }

    /**
     * Saves the current projects being managed by the splash screen into the recent
     * project list file.
     */
    saveProjects() {
        this._projectSerializer.saveProjects(this.projectListFile, this._projects);
    }

    private resizeAndCenterWindow() {
        this._window.setSize(945, 645);
        this._window.center();
        this._window.setResizable(false);
    }

    private onNewProjectClick(event : any) {
        this._dialog.showOpenDialog(
            this._dialogOptions,
            (dirNames : string[]) => {
                if (dirNames) {
                    this.openProject({
                        path: dirNames[0],
                        title: this._path.basename(dirNames[0])
                    });
                }
            });
    }

    private openProject(project : ProjectModel) {
        this.reorderProject(project);
        this.saveProjects();
        this.maximizeWindow().then(() => this.projectOpened.emit(project.path));
    }

    private maximizeWindow() : Promise<any> {
        this._window.setResizable(true);
        this._window.maximize();

        return new Promise(resolve => setTimeout(resolve, 100));
    }

    private reorderProject(openedProject : ProjectModel) {
        this._projects = this._projects.filter((project) => project.path !== openedProject.path);
        this._projects = ([openedProject].concat(this._projects)).slice(0, MAX_SPLASH_ENTRIES);
    }

    get projectListFile() : string {
        return this._path.join(this._path.home(),".duckling","recent_projects.json");
    }
}
