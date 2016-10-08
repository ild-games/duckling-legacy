import {Component, Input, ChangeDetectorRef} from '@angular/core';

import {Entity} from '../entitysystem';
import {EntityEditorComponent} from '../entityeditor';
import {MapEditorComponent} from '../canvas/map-editor.component';
import {SplashComponent} from '../splash/splash.component';
import {ProjectService} from '../project';
import {WindowService} from '../util';
import {StoreService} from '../state';
import {FileToolbarService} from './file-toolbar.service';

@Component({
    selector: 'dk-shell',
    styleUrls: ['./duckling/shell/shell.component.css'],
    template: `
        <div *ngIf="showSplash">
            <dk-splash-screen
                (projectOpened)="onProjectOpened($event)">
            </dk-splash-screen>
        </div>

        <div *ngIf="showLoading">
            Loading...
        </div>

        <div class="shell" *ngIf="showProject">
            <div class="the-duck-bg-img"></div>

            <div class="canvas-container">
                <dk-map-editor>
                </dk-map-editor>
            </div>
            <div class="entity-editor-container">
                <dk-entity-editor>
                </dk-entity-editor>
            </div>
        </div>
    `
})
export class ShellComponent {
    constructor(public projectService : ProjectService,
                private _store : StoreService,
                private _windowService : WindowService,
                private _fileToolbar : FileToolbarService) {
        this._windowService.setMinimumSize(0, 0);
        this._initToolbar();
    }

    onProjectOpened(path : string) {
        this.projectService.open(path);
        this._windowService.setMinimumSize(1300, 500);
    }

    private _initToolbar() {
        this._fileToolbar.addAction({
            menuPath : ["File"],
            label: "Undo",
            shortcut: "CmdOrCtrl+Z",
            callback : () => this._store.undo()
        });

        this._fileToolbar.addAction({
            menuPath : ["File"],
            label: "Redo",
            shortcut: "CmdOrCtrl+Shift+Z",
            callback : () => this._store.redo()
        });

        this._fileToolbar.bootstrapMenu();
    }

    get showSplash() {
        return !this.projectService.project.home;
    }

    get showLoading() {
        return !this.showSplash && !this.projectService.project.loaded;
    }

    get showProject() {
        return !this.showSplash && !this.showLoading;
    }
}
