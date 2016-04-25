import {
    OnInit,
    Component,
    Input
} from 'angular2/core';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {remote} from 'electron';

import {JsonLoaderService} from '../util/json-loader.service';
import {PathService} from '../util/path.service';

interface ProjectModel {
    title : string,
    path : string
}

@Component({
    selector: 'dk-splash-screen',
    directives: [
        MD_LIST_DIRECTIVES
    ],
    styleUrls: [ './duckling/splash/splash.component.css' ],
    template: `
        <div class="splash-screen">
            <div class="left-section">
                <md-list>
                    <md-list-item *ngFor="#project of projects">
                        <h3 md-line> {{project.title}} </h3>
                        <p md-line> {{project.path}} </p>
                    </md-list-item>
                </md-list>

                <div class="actions">
                    <a (click)="onNewProjectClick($event)">
                        NEW PROJECT
                    </a>
                </div>
            </div>

            <div class="right-section">
                <div class="duckling-title">
                    <div class="duckling-name">
                        Duckling
                    </div>
                    <div class="duckling-version">
                        {{version}}
                    </div>
                </div>
            </div>

            <div class="the-duck"></div>
        </div>
    `
})
export class SplashComponent implements OnInit {
    private version : string = "0.0.1";
    private projects : ProjectModel[] = [];
    private dialogOptions : {};
    private dialog = remote.require('dialog');
    private MAX_ENTRIES : number = 7;

    constructor(private _jsonLoader : JsonLoaderService,
                private _path : PathService) {
        this.dialogOptions = {
            defaultPath: this._path.home(),
            properties: [
                'openDirectory',
                'createDirectory'
            ]
        };
    }

    ngOnInit() {
        this.resizeAndCenterWindow();
        this.loadProject();
    }

    loadProject() {
        this._jsonLoader.getJsonFromPath(this.projectListPath).then((json) => {
            if (json) {
                this.projects = JSON.parse(json);
            } else {
                this.projects = [];
            }
        },(error) => {
            this.projects = [];
        });
    }

    private resizeAndCenterWindow() {
        remote.getCurrentWindow().setSize(945, 645);
        remote.getCurrentWindow().center();
        remote.getCurrentWindow().setResizable(false);
    }

    private onNewProjectClick(event : any) {
        remote.require('dialog').showOpenDialog(
            remote.getCurrentWindow(),
            this.dialogOptions,
            (dirName : string) => this.openProject({
                path: dirName,
                title: this._path.basename(dirName)
            }));
    }

    private openProject(project : ProjectModel) {
        this.reorderProject(project);
        this.saveProjects();
    }

    private reorderProject(openedProject : ProjectModel) {
        this.projects = this.projects.filter((project) => project.path !== openedProject.path);
        this.projects = ([openedProject].concat(this.projects)).slice(0, this.MAX_ENTRIES);
    }

    saveProjects() {
        this._jsonLoader.saveJsonToPath(this.projectListPath, JSON.stringify(this.projects));
    }

    get projectListPath() {
        return this._path.join(this._path.home(),".duckling","recent_projects.json");
    }
}
