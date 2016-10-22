import {
    Component,
    Input,
    ChangeDetectorRef,
    OnDestroy,
    OnInit
} from '@angular/core';
import {Subscriber} from 'rxjs';

import {Entity} from '../entitysystem';
import {EntityEditorComponent} from '../entityeditor';
import {MapEditorComponent} from '../canvas/map-editor.component';
import {SplashComponent} from '../splash/splash.component';
import {FileToolbarService} from './file-toolbar.service';
import {Asset, AssetService} from '../project/asset.service';
import {ProjectService} from '../project/project.service';
import {WindowService, PathService} from '../util';
import {StoreService} from '../state';
import {OptionsService} from '../state/options.service';

@Component({
    selector: 'dk-shell',
    styleUrls: ['./duckling/shell/shell.component.css', './duckling/layout.css'],
    template: `
        <div *ngIf="showSplash">
            <dk-splash-screen
                (projectOpened)="onProjectOpened($event)">
            </dk-splash-screen>
        </div>

        <div *ngIf="showLoading" class="dk-centered-container">
            <md-spinner></md-spinner>
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
export class ShellComponent implements OnInit, OnDestroy {
    private _editorImagesLoaded : boolean = false;
    private _assetServiceSubscription : Subscriber<any>;

    constructor(public projectService : ProjectService,
                private _assetService : AssetService,
                private _pathService : PathService,
                private _optionsService : OptionsService,
                private _windowService : WindowService,
                private _fileToolbar : FileToolbarService,
                private _store : StoreService) {
    }

    ngOnDestroy() {
        this._assetServiceSubscription.unsubscribe();
    }

    ngOnInit() {
        let home = this._pathService.home();
        this._optionsService.loadSettings(this._pathService.join(home, ".duckling", "options.json"));

        this._windowService.setMinimumSize(0, 0);
        this._initToolbar();
        this._assetService.loadPreloadedEditorImages();

        this._assetServiceSubscription = this._assetService.preloadImagesLoaded.subscribe((allLoaded : boolean) => {
            this._editorImagesLoaded = allLoaded;
        }) as Subscriber<any>;
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
        let loadFinished = this.projectService.project.loaded && this._optionsService.isLoaded && this._editorImagesLoaded;
        return !this.showSplash && !loadFinished;
    }

    get showProject() {
        return !this.showSplash && !this.showLoading;
    }
}
