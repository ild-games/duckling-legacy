import {
    Component,
    Input,
    ChangeDetectorRef,
    OnDestroy
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
export class ShellComponent implements OnDestroy {
    private _editorImagesLoaded : boolean = false;
    private _assetServiceSubscription : Subscriber<any>;

    constructor(public projectService : ProjectService,
                private _assetService : AssetService,
                private _pathService : PathService,
                private _windowService : WindowService,
                private _fileToolbar : FileToolbarService) {
        this._windowService.setMinimumSize(0, 0);
        this._initToolbar();
        this._assetService.loadPreloadedEditorImages();

        this._assetServiceSubscription = this._assetService.preloadImagesLoaded.subscribe((allLoaded : boolean) => {
            this._editorImagesLoaded = allLoaded;
        }) as Subscriber<any>;
    }

    ngOnDestroy() {
        this._assetServiceSubscription.unsubscribe();
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

    private _preloadEditorImages(imageFiles : string[]) {
        for (let imageFile of imageFiles) {
            this._assetService.add(this._textureFromImageFile(imageFile), imageFile, true);
            this._numImagesToLoad++;
        }
        this._imagesLoaded = this._areAllImagesLoaded();
    }

    private _textureFromImageFile(imageFile : string) : Asset {
        return {
            type: "TexturePNG",
            key: this._stripPreloadedImageKey(imageFile)
        };
    }

    private _stripPreloadedImageKey(imageFile : string) {
        let folderPieces = imageFile.split(this._pathService.folderSeparator);
        let key = folderPieces[folderPieces.length - 1];
        return key.replace('.png', '');
    }

    private _imageLoaded() {
        this._numImagesLoaded++;
    }

    private _areAllImagesLoaded() : boolean {
        return this._numImagesToLoad <= this._numImagesLoaded;
    }

    get showSplash() {
        return !this.projectService.project.home;
    }

    get showLoading() {
        return (
            !this.showSplash &&
            !this.projectService.project.loaded &&
            !this._editorImagesLoaded
        );
    }

    get showProject() {
        return !this.showSplash && !this.showLoading;
    }
}
