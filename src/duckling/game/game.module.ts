import { NgModule } from "@angular/core";

import { ControlsModule } from "../controls/controls.module";
import { ProjectModule } from "../project/project.module";
import { ActionComponent } from "./action/action.component";
import { CameraComponent } from "./camera/camera.component";
import { CollisionComponent } from "./collision/collision.component";
import { DrawableComponent } from "./drawable/drawable.component";
import { PositionComponent } from "./position/position.component";
import { RotateComponent } from "./rotate/rotate.component";
import { TriggerDeathComponent } from "./trigger-death/trigger-death.component";
import { ButtonComponent } from "./button/button.component";
import { PathComponent } from "./path/path.component";
import { PathFollowerComponent } from "./path/path-follower.component";
import { SoundAttributeComponent } from "./audio/sound-attribute.component";
import { SoundComponent } from "./audio/sound.component";
import { MusicAttributeComponent } from "./audio/music-attribute.component";
import { MusicComponent } from "./audio/music.component";
import { AutoStartMusicAttributeComponent } from "./audio/auto-start-music-attribute.component";

import { AnconaSFMLRenderPriorityService } from "./ancona-sfml-render-priority.service";
import { RenderPriorityService } from "../canvas/drawing/render-priority.service";

import { AnimatedDrawableComponent } from "./drawable/animated-drawable.component";
import { AutoCreateAnimationDialogComponent } from "./drawable/auto-create-animation-dialog.component";
import { ContainerDrawableComponent } from "./drawable/container-drawable.component";
import { CircleComponent } from "./drawable/circle.component";
import { DrawableAttributeComponent } from "./drawable/drawable-attribute.component";
import { GenericDrawableComponent } from "./drawable/generic-drawable.component";
import { ImageDrawableComponent } from "./drawable/image-drawable.component";
import { TileBlockDrawableComponent } from "./drawable/tile-block-drawable.component";
import { TextDrawableComponent } from "./drawable/text-drawable.component";
import { SFMLTextComponent } from "./drawable/sfml-text.component";
import { RectangleComponent } from "./drawable/rectangle.component";
import { ShapeDrawableComponent } from "./drawable/shape-drawable.component";
import { GenericShapeComponent } from "./drawable/generic-shape.component";

import { CollisionTypesService } from "./collision/collision-types.service";
import { EditCollisionTypesComponent } from "./collision/edit-collision-types.component";
import { editCollisionTypeMigration } from "./collision/collision-migration";

import {
    AttributeDefaultService,
    EntityBoxService,
    EntitySystemService,
    EntityPositionService,
    EntityLayerService,
} from "../entitysystem";
import { AttributeComponentService } from "../entityeditor";
import { EntityDrawerService } from "../canvas/drawing/entity-drawer.service";
import { RequiredAssetService } from "../project";
import { ProjectLifecycleService } from "../project/project-lifecycle.service";
import { MigrationService } from "../migration/migration.service";

import { bootstrapGameComponents } from "./index";
import { AttributeDefaultAugmentationService } from "../entitysystem/services/attribute-default-augmentation.service";

const ATTRIBUTE_COMPONENTS = [
    ActionComponent,
    CameraComponent,
    CollisionComponent,
    DrawableAttributeComponent,
    PositionComponent,
    RotateComponent,
    TriggerDeathComponent,
    ButtonComponent,
    PathComponent,
    PathFollowerComponent,
    SoundAttributeComponent,
    MusicAttributeComponent,
    AutoStartMusicAttributeComponent,
];

@NgModule({
    imports: [ControlsModule, ProjectModule],
    declarations: [
        ATTRIBUTE_COMPONENTS,
        AnimatedDrawableComponent,
        ContainerDrawableComponent,
        CircleComponent,
        DrawableComponent,
        GenericDrawableComponent,
        ImageDrawableComponent,
        TileBlockDrawableComponent,
        TextDrawableComponent,
        SFMLTextComponent,
        RectangleComponent,
        ShapeDrawableComponent,
        GenericShapeComponent,
        AutoCreateAnimationDialogComponent,
        EditCollisionTypesComponent,
        SoundComponent,
        MusicComponent,
    ],
    exports: [ATTRIBUTE_COMPONENTS],
    providers: [
        {
            provide: RenderPriorityService,
            useClass: AnconaSFMLRenderPriorityService,
        },
        CollisionTypesService,
    ],
    entryComponents: [
        ATTRIBUTE_COMPONENTS,
        AutoCreateAnimationDialogComponent,
        EditCollisionTypesComponent,
    ],
})
export class GameModule {
    constructor(
        public attributeDefaultService: AttributeDefaultService,
        public attributeDefaultAugmentationService: AttributeDefaultAugmentationService,
        public entityPositionService: EntityPositionService,
        public entityBoxService: EntityBoxService,
        public attributeComponentService: AttributeComponentService,
        public entityDrawerService: EntityDrawerService,
        public requiredAssetService: RequiredAssetService,
        public entityLayerService: EntityLayerService,
        private _collisionTypesService: CollisionTypesService,
        private _projectLifecycleService: ProjectLifecycleService,
        private _migrationService: MigrationService
    ) {
        bootstrapGameComponents(this);
        this._bootstrapLifecycle();
        this._registerExistingCodeMigrations();
    }

    private _bootstrapLifecycle() {
        this._bootstrapAfterMapLoadLifecycle();
        this._bootstrapBeforeMapSaveLifecycle();
    }

    private _bootstrapAfterMapLoadLifecycle() {
        this._projectLifecycleService.addPostLoadMapHook((map) =>
            this._collisionTypesService.postLoadMapHook(map)
        );
    }

    private _bootstrapBeforeMapSaveLifecycle() {
        this._projectLifecycleService.addPreSaveMapHook((map) =>
            this._collisionTypesService.preSaveMapHook(map)
        );
    }

    private _registerExistingCodeMigrations() {
        this._migrationService.registerExistingCodeMigration(
            editCollisionTypeMigration
        );
    }
}
