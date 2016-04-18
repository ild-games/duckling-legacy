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
    styles: [`
        ._splash-screen {
            background-color: #212121;
            height: 100%;
        }

        ._left-section {
            padding: 1em;
        }

        md-list {
            background-color: white;
            width: 375px;
        }

        ._actions {
            margin-left: 1em;
            position: absolute;
            bottom: 1em;
        }

        ._actions > a {
            text-decoration: none;
            color: #FFFFFF;
            font-size: 1.5em;
        }
    `],
    template: `
        <div class="_splash-screen">
            <div class="_left-section">
                <md-list>
                    <md-list-item *ngFor="#project of projects">
                        <h3 md-line> {{project.title}} </h3>
                        <p md-line> {{project.path}} </p>
                    </md-list-item>
                </md-list>
            </div>
            <div class="_actions">
                <a>NEW PROJECT</a>
            </div>
        </div>
    `
})
export class SplashComponent implements OnInit {
    private version : string = "0.0.1";
    private projects : ProjectModel[] = [];

    constructor(private _jsonLoader : JsonLoaderService,
                private _path : PathService) {
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


    get projectListPath() {
        return this._path.join(this._path.home(),".duckling","recent_projects.json");
    }
}
