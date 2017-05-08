import "reflect-metadata";
import 'mocha';
import {expect} from 'chai';

import {createStoreService, createEntityService, createEntityBoxService} from '../helper/state';
import {EntitySystemService, EntityPositionService, EntityKey, Entity} from '../../duckling/entitysystem';
import {EntityLayerService} from '../../duckling/entitysystem/services/entity-layer.service';
import {AvailableAttributeService} from '../../duckling/entitysystem/services/available-attribute.service';
import {AttributeDefaultService} from '../../duckling/entitysystem/services/attribute-default.service';
import {EntityDrawerService} from '../../duckling/canvas/drawing/entity-drawer.service';
import {RenderPriorityService} from '../../duckling/canvas/drawing/render-priority.service';
import {AssetService} from '../../duckling/project/asset.service';
import {RequiredAssetService} from '../../duckling/project/required-asset.service';
import {ProjectService} from '../../duckling/project/project.service';
import {MapParserService} from '../../duckling/project/map-parser.service';
import {ProjectLifecycleService} from '../../duckling/project/project-lifecycle.service';
import {SnackBarService} from '../../duckling/project/snackbar.service';
import {PathService} from '../../duckling/util/path.service';
import {JsonLoaderService} from '../../duckling/util/json-loader.service';
import {DialogService} from '../../duckling/util/dialog.service';
import {SelectionService} from '../../duckling/selection/selection.service';
import {CopyPasteService} from '../../duckling/selection/copy-paste.service';
import {MigrationService} from '../../duckling/migration/migration.service';
import {Vector} from '../../duckling/math';
import {immutableAssign} from '../../duckling/util';

class MockPositionService extends EntityPositionService {
    constructor() {
        super();
    }

    setPosition(entity : Entity, newPosition : Vector) {
        return immutableAssign(entity, {position : newPosition});
    }
}

let entity = {
    position : {
        x: 0,
        y: 0
    },
    drawable : {
        image : "foo.jpg"
    }
}

const ENTITY_KEY = "theEntity";

describe("CopyPasteService", function() {
    beforeEach(function() {
        this.store = createStoreService();
        this.entitySystem = createEntityService(this.store);
        this.entityPositionService = new EntityPositionService();
        this.assetService = new AssetService(this.store, new PathService() , new RequiredAssetService()) ;
        this.entityBoxService = createEntityBoxService(this.assetService, this.entityPositionService, this.entitySystem);
        this.layerService = new EntityLayerService(this.entitySytem, this.store);
        this.positionService = new MockPositionService();
        this.path = new PathService();
        this.requiredAssets = new RequiredAssetService();
        this.assets = new AssetService(this.store, this.path, this.requiredAssets);
        this.renderPriority = new RenderPriorityService();
        this.attributeDefault = new AttributeDefaultService();
        this.jsonLoader = new JsonLoaderService(this.path);
        this.migrationService = new MigrationService(this.path, this.jsonLoader);
        this.projectLifecycle = new ProjectLifecycleService();
        this.mapParser = new MapParserService(this.assets, this.requiredAssets, this.projectLifecycle);
        this.dialog = new DialogService();
        this.snackbar = new SnackBarService();
        this.project = new ProjectService(this.entitySystem, this.store, this.migrationService, this.jsonLoader, this.path, this.mapParser, this.dialog, this.snackbar);
        this.availableAttributes = new AvailableAttributeService(this.attributeDefault, this.project);
        this.drawer = new EntityDrawerService(this.assets, this.renderPriority, this.positionService, this.entitySystem, this.layerService, this.availableAttributes, this.store);
        this.selection = new SelectionService(this.store, this.entitySystem, this.layerService, this.drawer, null, null);
        this.copyPaste = new CopyPasteService(this.store, this.entitySystem, this.selection, this.positionService);
    });

    it("starts with an empty clipboard", function() {
        expect(this.copyPaste.clipboard.value).to.eql({});
    });

    it("copying an entity updates the store with that entity", function() {
        this.entitySystem.updateEntity(ENTITY_KEY, entity);
        this.copyPaste.copy(ENTITY_KEY);
        expect(this.copyPaste.clipboard.value).to.eql({copiedEntity: entity});
    });

    describe("pasting an enitity", function() {
        beforeEach(function() {
            this.entitySystem.updateEntity(ENTITY_KEY, entity);
            this.newPosition = {x : 3, y : 7};
            this.movedEntity = immutableAssign(entity, {position : this.newPosition});
        });

        function size(entitySystem : any) {
            return entitySystem.entitySystem.value.size;
        }

        it("creates a new entity at the specified location", function() {
            this.copyPaste.copy(ENTITY_KEY);
            let key = this.copyPaste.paste(this.newPosition);
            let entity = this.entitySystem.getEntity(key);
            expect(entity).to.eql(this.movedEntity);
        });

        it("with an empty clipboard does not creat an entity", function() {
            let systemSize = size(this.entitySystem);
            this.copyPaste.paste(this.newPosition);
            expect(size(this.entitySystem)).to.eql(systemSize++);
        });

        it("with an empty clipboard returns null", function() {
            let systemSize = size(this.entitySystem);
            expect(this.copyPaste.paste(this.newPosition)).to.eql(null);
        });

        it("can be undone with one call to undo", function() {
            this.copyPaste.copy(ENTITY_KEY);
            let key = this.copyPaste.paste(this.newPosition);
            this.store.undo();
            expect(!!this.entitySystem.getEntity(key)).not.to.eql(true);
        });
    });
});
