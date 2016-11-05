import {NgModule} from '@angular/core';

import {ControlsModule} from '../controls/controls.module';
import {ProjectModule} from '../project/project.module';
import {ActionComponent} from './action/action.component';
import {CameraComponent} from './camera/camera.component';
import {CollisionComponent} from './collision/collision.component';
import {DrawableComponent} from './drawable/drawable.component';
import {PositionComponent} from './position/position.component';
import {RotateComponent} from './rotate/rotate.component';

import {AnimatedDrawableComponent} from './drawable/animated-drawable.component';
import {AutoCreateAnimationDialogComponent} from './drawable/auto-create-animation-dialog.component';
import {ContainerDrawableComponent} from './drawable/container-drawable.component';
import {OvalComponent} from './drawable/oval.component';
import {DrawableAttributeComponent} from './drawable/drawable-attribute.component';
import {GenericDrawableComponent} from './drawable/generic-drawable.component';
import {ImageDrawableComponent} from './drawable/image-drawable.component';
import {TextDrawableComponent} from './drawable/text-drawable.component';
import {SFMLTextComponent} from './drawable/sfml-text.component';
import {RectangleComponent} from './drawable/rectangle.component';
import {ShapeDrawableComponent} from './drawable/shape-drawable.component';
import {GenericShapeComponent} from './drawable/generic-shape.component';

import {
    AttributeDefaultService,
    EntityBoxService,
    EntitySystemService,
    EntityPositionService
} from '../entitysystem';
import {EntityEligibleResizeService} from '../entitysystem/services/entity-eligible-resize.service';
import {EntitySizeService} from '../entitysystem/services/entity-size.service';
import {AttributeComponentService} from '../entityeditor';
import {EntityDrawerService} from '../canvas/drawing/entity-drawer.service';
import {RequiredAssetService} from '../project';
import {AnconaSFMLRenderPriorityService} from './ancona-sfml-render-priority.service';
import {RenderPriorityService} from '../canvas/drawing/render-priority.service';

import {bootstrapGameComponents} from './index';

const ATTRIBUTE_COMPONENTS = [
        ActionComponent,
        CameraComponent,
        CollisionComponent,
        DrawableAttributeComponent,
        PositionComponent,
        RotateComponent
]

@NgModule({
    imports: [
        ControlsModule,
        ProjectModule
    ],
    declarations: [
        ATTRIBUTE_COMPONENTS,
        AnimatedDrawableComponent,
        ContainerDrawableComponent,
        OvalComponent,
        DrawableComponent,
        GenericDrawableComponent,
        ImageDrawableComponent,
        TextDrawableComponent,
        SFMLTextComponent,
        RectangleComponent,
        ShapeDrawableComponent,
        GenericShapeComponent,
        AutoCreateAnimationDialogComponent
    ],
    exports: [
        ATTRIBUTE_COMPONENTS
    ],
    providers: [
        {provide: RenderPriorityService, useClass: AnconaSFMLRenderPriorityService}
    ],
    entryComponents: [
        ATTRIBUTE_COMPONENTS,
        AutoCreateAnimationDialogComponent
    ]
})
export class GameModule {
    constructor(public attributeDefaultService : AttributeDefaultService,
                public entityPositionService : EntityPositionService,
                public entityBoxService : EntityBoxService,
                public attributeComponentService : AttributeComponentService,
                public entityDrawerService : EntityDrawerService,
                public requiredAssetService : RequiredAssetService,
                public entityEligibleResizeService : EntityEligibleResizeService,
                public entitySizeService : EntitySizeService) {
        bootstrapGameComponents(this);
    }
}
