import {
    OnInit,
    Component,
    Input,
    Output,
    EventEmitter,
    NgZone
} from 'angular2/core';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {remote} from 'electron';

import {JsonLoaderService} from '../util/json-loader.service';
import {PathService} from '../util/path.service';
import {DialogService} from '../util/dialog.service';

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
                <md-nav-list>
                    <md-list-item
                    md-list-item
                    *ngFor="#project of projects"
                    (click)="openProject({title: project.title, path: project.path})">
                        <p md-line class="project-title"> {{project.title}} </p>
                        <p md-line class="project-path"> {{project.path}} </p>
                    </md-list-item>
                </md-nav-list>

                <div class="actions">
                    <a (click)="onNewProjectClick($event)">
                        <i class="fa fa-file-o" aria-hidden="true"></i>
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
    private MAX_ENTRIES : number = 8;

    @Output()
    projectOpened : EventEmitter<ProjectModel> = new EventEmitter();

    constructor(private jsonLoader : JsonLoaderService,
                private path : PathService,
                private dialog : DialogService,
                private zone : NgZone) {
        this.dialogOptions = {
            defaultPath: this.path.home(),
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

    loadProjects() {
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

    private resizeAndCenterWindow() {
        remote.getCurrentWindow().setSize(945, 645);
        remote.getCurrentWindow().center();
        remote.getCurrentWindow().setResizable(false);
    }

    private onNewProjectClick(event : any) {
        this.dialog.showOpenDialog(
            remote.getCurrentWindow(),
            this.dialogOptions,
            (dirNames : string[]) => {
                if (dirNames) {
                    this.openProject({
                        path: dirNames[0],
                        title: this.path.basename(dirNames[0])
                    });
                }
            });
    }

    private openProject(project : ProjectModel) {
        this.reorderProject(project);
        this.saveProjects();
        this.maximizeWindow();
        this.projectOpened.emit(project);
    }

    private maximizeWindow() {
        remote.getCurrentWindow().setResizable(true);
        remote.getCurrentWindow().maximize();
    }

    private reorderProject(openedProject : ProjectModel) {
        this.projects = this.projects.filter((project) => project.path !== openedProject.path);
        this.projects = ([openedProject].concat(this.projects)).slice(0, this.MAX_ENTRIES);
    }

    saveProjects() {
        this.jsonLoader.saveJsonToPath(this.projectListPath, JSON.stringify(this.projects));
    }

    get projectListPath() {
        return this.path.join(this.path.home(),".duckling","recent_projects.json");
    }
}
