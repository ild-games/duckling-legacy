import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscriber } from 'rxjs';

import { AssetService } from '../project/asset.service';
import { ProjectService } from '../project/project.service';
import { CustomAttributesComponent } from '../project/custom-attributes.component';
import { MigrateAllMapsComponent } from '../project/migrate-all-maps.component';
import { WindowService, PathService } from '../util';
import { StoreService } from '../state';
import { OptionsService } from '../state/options.service';
import { MinifyAllMapsComponent } from '../project/minify-all-maps.component';

@Component({
  selector: 'dk-shell',
  styleUrls: ['./shell.component.scss', './../layout.scss'],
  template: `
    <div *ngIf="showSplash">
      <dk-splash-screen (projectOpened)="onProjectOpened($event)">
      </dk-splash-screen>
    </div>

    <div *ngIf="showLoading" class="dk-centered-container">
      <mat-spinner></mat-spinner>
    </div>

    <div class="shell" *ngIf="showProject">
      <div class="the-duck-bg-img"></div>

      <div class="canvas-container">
        <dk-map-editor> </dk-map-editor>
      </div>
      <div class="entity-editor-container">
        <dk-entity-editor> </dk-entity-editor>
      </div>
    </div>
  `,
})
export class ShellComponent implements OnInit, OnDestroy {
  private _editorImagesLoaded: boolean = false;
  private _assetServiceSubscription: Subscriber<any> | undefined;

  constructor(
    public projectService: ProjectService,
    private _assetService: AssetService,
    private _pathService: PathService,
    private _optionsService: OptionsService,
    private _windowService: WindowService,
    private _store: StoreService,
    private _viewContainer: ViewContainerRef,
    private _dialog: MatDialog
  ) {}

  ngOnDestroy() {
    this._assetServiceSubscription?.unsubscribe();
  }

  ngOnInit() {
    let home = this._pathService.home();
    this._optionsService.loadSettings(
      this._pathService.join(home, '.duckling', 'options.json')
    );

    this._windowService.setMinimumSize(0, 0);
    this._initSplashToolbar();
    this._assetService.loadPreloadedEditorAssets();

    this._assetServiceSubscription =
      this._assetService.preloadAssetsLoaded.subscribe((allLoaded: boolean) => {
        this._editorImagesLoaded = allLoaded;
      }) as Subscriber<any>;
  }

  onProjectOpened(path: string) {
    this.projectService.open(path);
    this._windowService.setMinimumSize(1300, 500);
    this._initProjectToolbar();
  }

  private _initSplashToolbar() {
    electron_api.menu.addSplashItems();
    document.addEventListener('undo', () => this._store.undo());
    document.addEventListener('redo', () => this._store.redo());
  }

  private _initProjectToolbar() {
    electron_api.menu.addProjectItems();
    document.addEventListener('ild_editCustomAttributes', () =>
      this._dialog.open(CustomAttributesComponent)
    );
    document.addEventListener('ild_runMigrations:all_maps', () =>
      this._dialog.open(MigrateAllMapsComponent, {
        disableClose: true,
      })
    );

    document.addEventListener('ild_minify_maps', () =>
      this._dialog.open(MinifyAllMapsComponent, {
        disableClose: true,
      })
    );
  }

  get showSplash() {
    return !this.projectService.home;
  }

  get showLoading() {
    let loadFinished =
      this.projectService.project.getValue().loaded &&
      this._optionsService.isLoaded &&
      this._editorImagesLoaded;
    return !this.showSplash && !loadFinished;
  }

  get showProject() {
    return !this.showSplash && !this.showLoading;
  }
}
