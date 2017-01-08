import {
    AttributeDefaultService,
    EntityBoxService,
    EntitySystemService,
    EntityPositionService,
    EntityLayerService
} from '../entitysystem';
import {AttributeComponentService} from '../entityeditor';
import {EntityDrawerService} from '../canvas/drawing/entity-drawer.service';
import {RequiredAssetService} from '../project';

import {defaultButton, BUTTON_KEY} from './button/button-attribute';
import {ButtonComponent} from './button/button.component';

import {defaultPosition, POSITION_KEY} from './position/position-attribute';
import {setPosition} from './position/set-position';
import {getPosition} from './position/get-position';
import {defaultCollision, COLLISION_KEY} from './collision/collision-attribute';
import {PositionComponent} from './position/position.component';
import {CollisionComponent} from './collision/collision.component';
import {drawCollision} from './collision/collision-drawer';
import {collisionBoundingBox} from './collision/collision-box';

import {defaultCamera, CAMERA_KEY} from './camera/camera-attribute';
import {drawCameraAttribute} from './camera/camera-drawer';
import {cameraBoundingBox} from './camera/camera-box';
import {CameraComponent} from './camera/camera.component';

import {defaultAction, ACTION_KEY} from './action/action-attribute';
import {ActionComponent} from './action/action.component';

import {defaultRotate, ROTATE_KEY} from './rotate/rotate-attribute';
import {RotateComponent} from './rotate/rotate.component';

import {defaultTriggerDeath, TRIGGER_DEATH_KEY} from './trigger-death/trigger-death-attribute';
import {TriggerDeathComponent} from './trigger-death/trigger-death.component';

import {defaultDrawableAttribute, DRAWABLE_KEY} from './drawable/drawable-attribute';
import {DrawableAttributeComponent} from './drawable/drawable-attribute.component';
import {drawDrawableAttribute} from './drawable/drawable-drawer';
import {drawableBoundingBox} from './drawable/drawable-bounding-box';
import {entityRequiredDrawableAssets} from './drawable/drawable-required-assets';
import {getLayer} from './drawable/get-layer';

type Services = {
    attributeDefaultService : AttributeDefaultService;
    entityPositionService : EntityPositionService,
    entityBoxService: EntityBoxService,
    attributeComponentService: AttributeComponentService,
    entityDrawerService: EntityDrawerService,
    requiredAssetService  : RequiredAssetService,
    entityLayerService : EntityLayerService,
};

let _bootstrapFunctions : Function[] = [
    _bootstrapPositionAttribute,
    _bootstrapCollisionAttribute,
    _bootstrapCameraAttribute,
    _bootstrapDrawableAttribute,
    _bootstrapActionAttribute,
    _bootstrapRotateAttribute,
    _bootstrapButtonAttribute,
    _bootstrapTriggerDeathAttribute
];

/**
 * Initialize the Services used by duckling to interact with the attribute implementations.
 */
export function bootstrapGameComponents(services: Services) {
    _bootstrapFunctions.map((func) => func(services));
}

function _bootstrapPositionAttribute(services : Services) {
    services.attributeComponentService.register(POSITION_KEY, PositionComponent);
    services.attributeDefaultService.register(POSITION_KEY, {createByDefault: true, default: defaultPosition});
    services.entityPositionService.register(POSITION_KEY, {set: setPosition, get: getPosition});
}

function _bootstrapButtonAttribute(services : Services) {
    services.attributeComponentService.register(BUTTON_KEY, ButtonComponent);
    services.attributeDefaultService.register(BUTTON_KEY, {createByDefault: false, default: defaultButton});
}

function _bootstrapCollisionAttribute(services : Services) {
    services.attributeComponentService.register(COLLISION_KEY, CollisionComponent);
    services.entityDrawerService.register(COLLISION_KEY, drawCollision);
    services.entityBoxService.register(COLLISION_KEY, collisionBoundingBox);
    services.attributeDefaultService.register(COLLISION_KEY, {createByDefault: true, default: defaultCollision});
}

function _bootstrapCameraAttribute(services : Services) {
    services.attributeComponentService.register(CAMERA_KEY, CameraComponent);
    services.attributeDefaultService.register(CAMERA_KEY, {createByDefault: false, default: defaultCamera});
    services.entityDrawerService.register(CAMERA_KEY, drawCameraAttribute);
    services.entityBoxService.register(CAMERA_KEY, cameraBoundingBox);
}

function _bootstrapDrawableAttribute(services : Services) {
    services.attributeComponentService.register(DRAWABLE_KEY, DrawableAttributeComponent);
    services.attributeDefaultService.register(DRAWABLE_KEY, {createByDefault: true, default: defaultDrawableAttribute});
    services.entityBoxService.register(DRAWABLE_KEY, drawableBoundingBox);
    services.entityDrawerService.register(DRAWABLE_KEY, drawDrawableAttribute);
    services.requiredAssetService.register(DRAWABLE_KEY, entityRequiredDrawableAssets);
    services.requiredAssetService.register(DRAWABLE_KEY, entityRequiredDrawableAssets);
    services.entityLayerService.register(DRAWABLE_KEY, getLayer);
}

function _bootstrapActionAttribute(services : Services) {
    services.attributeComponentService.register(ACTION_KEY, ActionComponent);
    services.attributeDefaultService.register(ACTION_KEY, {createByDefault: false, default: defaultAction});
}

function _bootstrapRotateAttribute(services : Services) {
    services.attributeComponentService.register(ROTATE_KEY, RotateComponent);
    services.attributeDefaultService.register(ROTATE_KEY, {createByDefault: false, default: defaultRotate});
}

function _bootstrapTriggerDeathAttribute(services : Services) {
    services.attributeComponentService.register(TRIGGER_DEATH_KEY, TriggerDeathComponent);
    services.attributeDefaultService.register(TRIGGER_DEATH_KEY, {createByDefault: false, default: defaultTriggerDeath});
}