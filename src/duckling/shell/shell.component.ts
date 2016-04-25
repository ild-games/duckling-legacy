import {Component, Input, ChangeDetectorRef} from 'angular2/core';
import {Entity} from '../entitysystem/entity';
import {EntityComponent} from '../entitysystem/entity.component';
import {MapEditorComponent} from '../canvas/map-editor.component';
import {SplashComponent} from '../splash/splash.component';
import {NumberInput} from '../controls/number-input.component';

import {BodyType, CollisionType} from '../game/collision/collision-attribute';

@Component({
    selector: 'duckling-shell',
    directives: [
        EntityComponent,
        SplashComponent,
        MapEditorComponent
    ],
    template: `
        <div *ngIf="!gameLoaded">
            <dk-splash-screen
                (projectOpened)="onProjectOpened()">
            </dk-splash-screen>
        </div>

        <div *ngIf="gameLoaded">
            <h1>This is the Shell</h1>
            <dk-map-editor>
            </dk-map-editor>
        </div>
    `
})
export class ShellComponent {

    private gameLoaded : boolean = false;

    onProjectOpened() {
        this.gameLoaded = true;
    }
}
