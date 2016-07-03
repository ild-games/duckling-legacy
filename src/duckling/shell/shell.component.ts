import {Component, Input, ChangeDetectorRef} from '@angular/core';

import {Entity} from '../entitysystem';
import {EntityEditorComponent} from '../entityeditor';
import {MapEditorComponent} from '../canvas/map-editor.component';
import {SplashComponent} from '../splash/splash.component';
import {ProjectService} from '../project';
import {WindowService} from '../util';

import {BodyType, CollisionType} from '../game/collision/collision-attribute';

@Component({
    selector: 'duckling-shell',
    directives: [
        EntityEditorComponent,
        SplashComponent,
        MapEditorComponent
    ],
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
    private _entity : Entity = {
        position: {
            position: {
                x: 0,
                y: 0
            },
            velocity: {
                x: 0,
                y: 0
            }
        },
        collision: {
            dimension: {
                dimension: {
                    x: 0,
                    y: 0
                }
            },
            oneWayNormal: {
                x: 0,
                y: 0
            },
            collisionType: CollisionType.Ground,
            bodyType: BodyType.Environment
        }
    }

    constructor(public projectService : ProjectService,
                private _windowService : WindowService) {
        this._windowService.setMinimumSize(0, 0);
    }

    onProjectOpened(path : string) {
        this.projectService.open(path);
        this._windowService.setMinimumSize(1300, 500);
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
