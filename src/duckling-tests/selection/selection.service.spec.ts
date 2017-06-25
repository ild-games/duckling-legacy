import "reflect-metadata";
import 'mocha';
import {expect} from 'chai';

import {createStoreService, createEntityService, createEntityBoxService} from '../helper/state';
import {SelectionService} from '../../duckling/selection';
import {AssetService} from '../../duckling/project/asset.service';
import {RequiredAssetService} from '../../duckling/project/required-asset.service';
import {PathService} from '../../duckling/util/path.service';
import {RenderPriorityService} from '../../duckling/canvas/drawing/render-priority.service';
import {immutableAssign} from '../../duckling/util';
import {EntityLayerService} from '../../duckling/entitysystem/services/entity-layer.service';
import {EntityPositionService} from '../../duckling/entitysystem/services/entity-position.service';
import {AvailableAttributeService} from '../../duckling/entitysystem/services/available-attribute.service';
import {AttributeDefaultService} from '../../duckling/entitysystem/services/attribute-default.service';
import {Entity} from '../../duckling/entitysystem/entity';
import {EntityDrawerService} from '../../duckling/canvas/drawing/entity-drawer.service';
import {ProjectService} from '../../duckling/project/project.service';
import {MapParserService} from '../../duckling/project/map-parser.service';
import {ProjectLifecycleService} from '../../duckling/project/project-lifecycle.service';
import {SnackBarService} from '../../duckling/project/snackbar.service';
import {JsonLoaderService} from '../../duckling/util/json-loader.service';
import {DialogService} from '../../duckling/util/dialog.service';
import {CopyPasteService} from '../../duckling/selection/copy-paste.service';
import {MigrationService} from '../../duckling/migration/migration.service';

let entity = {
    foo : {
        bar : "atone"
    }
};
const ENTITY_KEY = "theEntity";

class MockDrawerService extends EntityDrawerService {
    isEntityVisible(entity : Entity) {
        return true;
    }
}

describe("SelectionService", function() {
    beforeEach(function() {
        this.store = createStoreService();
        this.entitySystem = createEntityService(this.store);
        this.entityPositionService = new EntityPositionService();
        this.assetServices = new AssetService(this.store, new PathService(), new RequiredAssetService());
        this.entityBoxService = createEntityBoxService(this.assetService, this.entityPositionService, this.entitySystem);
        this.layerService = new EntityLayerService(this.entitySytem, this.store);
        this.positionService = new EntityPositionService();
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
        this.drawer = new MockDrawerService(this.assets, this.renderPriority, this.positionService, this.entitySystem, this.layerService, this.availableAttributes, this.store);
        this.selection = new SelectionService(this.store, this.entitySystem, this.drawer, this.layerService, this.entityBoxService, this.renderPriority);
    });

    it("with no selection, the selection behavior is empty", function() {
        expect(this.selection.selections.value).to.eql([]);
    });

    it("can make a selection even if the entity does not exist", function() {
        this.selection.select([ENTITY_KEY]);
        expect(this.selection.selections.value).to.eql([{key: ENTITY_KEY, entity: null}]);
    });

    it("creating an already selected entity will update the selection", function() {
        this.selection.select([ENTITY_KEY]);
        this.entitySystem.updateEntity(ENTITY_KEY, entity);
        expect(this.selection.selections.value).to.eql([{key: ENTITY_KEY, entity}]);
    });

    describe("with a selected entity", function() {
        beforeEach(function() {
            this.entitySystem.updateEntity(ENTITY_KEY, entity);
            this.selection.select([ENTITY_KEY]);
        });

        it("updating an already selected entity will update the selection", function() {
            let newEntity = immutableAssign(entity, {compa : {tr : "umpet"}});
            this.entitySystem.updateEntity(ENTITY_KEY, newEntity);
            let selection = {
                key : ENTITY_KEY,
                entity : newEntity
            }
            expect(this.selection.selections.value).to.eql([selection]);
        });

        it("it is possible to add to the selection", function() {
            this.selection.select(["theOther"]);
            expect(this.selection.selections.value).to.eql([
                {key: ENTITY_KEY, entity},
                {key: "theOther", entity : null}
            ]);
        });
    });

});
