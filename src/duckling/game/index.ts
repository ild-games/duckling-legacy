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

import { defaultButton, BUTTON_KEY } from "./button/button-attribute";
import { ButtonComponent } from "./button/button.component";

import { defaultPosition, POSITION_KEY } from "./position/position-attribute";
import { setPosition } from "./position/set-position";
import { getPosition } from "./position/get-position";
import {
    defaultCollision,
    COLLISION_KEY,
    defaultCollisionAugmentation,
} from "./collision/collision-attribute";
import { PositionComponent } from "./position/position.component";
import { CollisionComponent } from "./collision/collision.component";
import { getCollisionAttributeDrawnConstruct } from "./collision/collision-drawer";
import { collisionBoundingBox } from "./collision/collision-box";

import { defaultCamera, CAMERA_KEY } from "./camera/camera-attribute";
import { getCameraAttributeDrawnConstruct } from "./camera/camera-drawer";
import { cameraBoundingBox } from "./camera/camera-box";
import { CameraComponent } from "./camera/camera.component";

import { defaultAction, ACTION_KEY } from "./action/action-attribute";
import { ActionComponent } from "./action/action.component";

import { defaultRotate, ROTATE_KEY } from "./rotate/rotate-attribute";
import { RotateComponent } from "./rotate/rotate.component";

import {
    defaultTriggerDeath,
    TRIGGER_DEATH_KEY,
} from "./trigger-death/trigger-death-attribute";
import { TriggerDeathComponent } from "./trigger-death/trigger-death.component";

import { defaultPath, PATH_KEY } from "./path/path-attribute";
import { PathComponent } from "./path/path.component";
import { getPathAttributeDrawnConstruct } from "./path/path-drawer";
import { pathBox } from "./path/path-box";

import {
    defaultPathFollower,
    PATH_FOLLOWER_KEY,
} from "./path/path-follower-attribute";
import { PathFollowerComponent } from "./path/path-follower.component";

import {
    defaultDrawableAttribute,
    DRAWABLE_KEY,
} from "./drawable/drawable-attribute";
import { DrawableAttributeComponent } from "./drawable/drawable-attribute.component";
import { getDrawableAttributeDrawnConstruct } from "./drawable/drawable-drawer";
import { drawableBoundingBox } from "./drawable/drawable-bounding-box";
import { entityRequiredDrawableAssets } from "./drawable/drawable-required-assets";
import { getDrawableLayer } from "./drawable/drawable-get-layer";

import {
    SoundAttribute,
    SOUND_KEY,
    defaultSound,
    getSoundAttribute,
} from "./audio/sound-attribute";
import { entityRequiredSoundAssets } from "./audio/sound-required-assets";
import { SoundAttributeComponent } from "./audio/sound-attribute.component";
import { getSoundAttributeDrawnConstruct } from "./audio/sound-drawer";
import { soundBoundingBox } from "./audio/sound-box";

import {
    MusicAttribute,
    MUSIC_KEY,
    defaultMusic,
} from "./audio/music-attribute";
import { MusicAttributeComponent } from "./audio/music-attribute.component";
import { getMusicAttributeDrawnConstruct } from "./audio/music-drawer";
import { musicBoundingBox } from "./audio/music-box";

import {
    AutoStartMusicAttribute,
    AUTO_START_MUSIC_KEY,
    defaultAutoStartMusic,
} from "./audio/auto-start-music-attribute";
import { AutoStartMusicAttributeComponent } from "./audio/auto-start-music-attribute.component";

import { JsonComponent } from "../controls/json.component";
import { AttributeDefaultAugmentationService } from "../entitysystem/services/attribute-default-augmentation.service";

type Services = {
    attributeDefaultService: AttributeDefaultService;
    attributeDefaultAugmentationService: AttributeDefaultAugmentationService;
    entityPositionService: EntityPositionService;
    entityBoxService: EntityBoxService;
    attributeComponentService: AttributeComponentService;
    entityDrawerService: EntityDrawerService;
    requiredAssetService: RequiredAssetService;
    entityLayerService: EntityLayerService;
};

let _bootstrapFunctions: Function[] = [
    _bootstrapPositionAttribute,
    _bootstrapCollisionAttribute,
    _bootstrapCameraAttribute,
    _bootstrapDrawableAttribute,
    _bootstrapActionAttribute,
    _bootstrapRotateAttribute,
    _bootstrapButtonAttribute,
    _bootstrapTriggerDeathAttribute,
    _bootstrapPathAttribute,
    _bootstrapPathFollowerAttribute,
    _bootstrapSoundAttribute,
    _bootstrapMusicAttribute,
    _bootstrapAutoStartMusicAttribute,
];

/**
 * Initialize the Services used by duckling to interact with the attribute implementations.
 */
export function bootstrapGameComponents(services: Services) {
    _bootstrapFunctions.map((func) => func(services));
}

function _bootstrapPositionAttribute(services: Services) {
    services.attributeComponentService.register(
        POSITION_KEY,
        PositionComponent
    );
    services.attributeDefaultService.register(POSITION_KEY, {
        createByDefault: true,
        default: defaultPosition,
    });
    services.entityPositionService.register(POSITION_KEY, {
        set: setPosition,
        get: getPosition,
    });
}

function _bootstrapButtonAttribute(services: Services) {
    services.attributeComponentService.register(BUTTON_KEY, ButtonComponent);
    services.attributeDefaultService.register(BUTTON_KEY, {
        createByDefault: false,
        default: defaultButton,
    });
}

function _bootstrapCollisionAttribute(services: Services) {
    services.attributeComponentService.register(
        COLLISION_KEY,
        CollisionComponent
    );
    services.entityDrawerService.register(
        COLLISION_KEY,
        getCollisionAttributeDrawnConstruct
    );
    services.entityBoxService.register(COLLISION_KEY, collisionBoundingBox);
    services.attributeDefaultService.register(COLLISION_KEY, {
        createByDefault: true,
        default: defaultCollision,
    });
    services.attributeDefaultAugmentationService.register(
        COLLISION_KEY,
        defaultCollisionAugmentation
    );
}

function _bootstrapCameraAttribute(services: Services) {
    services.attributeComponentService.register(CAMERA_KEY, CameraComponent);
    services.attributeDefaultService.register(CAMERA_KEY, {
        createByDefault: false,
        default: defaultCamera,
    });
    services.entityDrawerService.register(
        CAMERA_KEY,
        getCameraAttributeDrawnConstruct
    );
    services.entityBoxService.register(CAMERA_KEY, cameraBoundingBox);
}

function _bootstrapDrawableAttribute(services: Services) {
    services.attributeComponentService.register(
        DRAWABLE_KEY,
        DrawableAttributeComponent
    );
    services.attributeDefaultService.register(DRAWABLE_KEY, {
        createByDefault: true,
        default: defaultDrawableAttribute,
    });
    services.entityBoxService.register(DRAWABLE_KEY, drawableBoundingBox);
    services.entityDrawerService.register(
        DRAWABLE_KEY,
        getDrawableAttributeDrawnConstruct
    );
    services.requiredAssetService.register(
        DRAWABLE_KEY,
        entityRequiredDrawableAssets
    );
    services.entityLayerService.register(DRAWABLE_KEY, getDrawableLayer);
}

function _bootstrapActionAttribute(services: Services) {
    services.attributeComponentService.register(ACTION_KEY, ActionComponent);
    services.attributeDefaultService.register(ACTION_KEY, {
        createByDefault: false,
        default: defaultAction,
    });
}

function _bootstrapRotateAttribute(services: Services) {
    services.attributeComponentService.register(ROTATE_KEY, RotateComponent);
    services.attributeDefaultService.register(ROTATE_KEY, {
        createByDefault: false,
        default: defaultRotate,
    });
}

function _bootstrapTriggerDeathAttribute(services: Services) {
    services.attributeComponentService.register(
        TRIGGER_DEATH_KEY,
        TriggerDeathComponent
    );
    services.attributeDefaultService.register(TRIGGER_DEATH_KEY, {
        createByDefault: false,
        default: defaultTriggerDeath,
    });
}

function _bootstrapPathAttribute(services: Services) {
    services.attributeComponentService.register(PATH_KEY, PathComponent);
    services.attributeDefaultService.register(PATH_KEY, {
        createByDefault: false,
        default: defaultPath,
    });
    services.entityDrawerService.register(
        PATH_KEY,
        getPathAttributeDrawnConstruct
    );
    services.entityBoxService.register(PATH_KEY, pathBox);
}

function _bootstrapPathFollowerAttribute(services: Services) {
    services.attributeComponentService.register(
        PATH_FOLLOWER_KEY,
        PathFollowerComponent
    );
    services.attributeDefaultService.register(PATH_FOLLOWER_KEY, {
        createByDefault: false,
        default: defaultPathFollower,
    });
}

function _bootstrapSoundAttribute(services: Services) {
    services.attributeComponentService.register(
        SOUND_KEY,
        SoundAttributeComponent
    );
    services.attributeDefaultService.register(SOUND_KEY, {
        createByDefault: false,
        default: defaultSound,
    });
    services.requiredAssetService.register(
        SOUND_KEY,
        entityRequiredSoundAssets
    );
    services.entityDrawerService.register(
        SOUND_KEY,
        getSoundAttributeDrawnConstruct
    );
    services.entityBoxService.register(SOUND_KEY, soundBoundingBox);
}

function _bootstrapMusicAttribute(services: Services) {
    services.attributeComponentService.register(
        MUSIC_KEY,
        MusicAttributeComponent
    );
    services.attributeDefaultService.register(MUSIC_KEY, {
        createByDefault: false,
        default: defaultMusic,
    });
    services.entityDrawerService.register(
        MUSIC_KEY,
        getMusicAttributeDrawnConstruct
    );
    services.entityBoxService.register(MUSIC_KEY, musicBoundingBox);
}

function _bootstrapAutoStartMusicAttribute(services: Services) {
    services.attributeComponentService.register(
        AUTO_START_MUSIC_KEY,
        AutoStartMusicAttributeComponent
    );
    services.attributeDefaultService.register(AUTO_START_MUSIC_KEY, {
        createByDefault: false,
        default: defaultAutoStartMusic,
    });
}
