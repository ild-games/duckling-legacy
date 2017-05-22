import "reflect-metadata";
import 'mocha';
import {expect} from 'chai';

import {createStoreService, createEntityService} from '../helper/state';
import {SelectionService} from '../../duckling/selection';
import {immutableAssign} from '../../duckling/util';
import {EntityLayerService} from '../../duckling/entitysystem/services/entity-layer.service';
import {Entity} from '../../duckling/entitysystem/entity';

let entity = {
    foo : {
        bar : "atone"
    }
};
const ENTITY_KEY = "theEntity";

class MockLayerService extends EntityLayerService {
    isEntityVisible(entity : Entity) : boolean {
        return true;
    }
}

describe("SelectionService", function() {
    beforeEach(function() {
        this.store = createStoreService();
        this.entitySystem = createEntityService(this.store);
        this.layerService = new MockLayerService(this.entitySytem, this.store);
        this.selection = new SelectionService(this.store, this.entitySystem, this.layerService);
    });

    it("with no selection, the selction behavior is empty", function() {
        expect(this.selection.selection.value).to.eql({});
    });

    it("can make a selection even if the entity does not exist", function() {
        this.selection.select(ENTITY_KEY);
        expect(this.selection.selection.value).to.eql({selectedEntity: ENTITY_KEY, entity : null});
    });

    it("creating an already selected entity will update the selection", function() {
        this.selection.select(ENTITY_KEY);
        this.entitySystem.updateEntity(ENTITY_KEY, entity);
        expect(this.selection.selection.value).to.eql({selectedEntity: ENTITY_KEY, entity});
    });

    describe("with a selected entity", function() {
        beforeEach(function() {
            this.entitySystem.updateEntity(ENTITY_KEY, entity);
            this.selection.select(ENTITY_KEY);
        });

        it("updating an already selected entity will update the selection", function() {
            let newEntity = immutableAssign(entity, {compa : {tr : "umpet"}});
            this.entitySystem.updateEntity(ENTITY_KEY, newEntity);
            let selection = {
                selectedEntity : ENTITY_KEY,
                entity : newEntity
            }
            expect(this.selection.selection.value).to.eql(selection);
        });

        it("it is possible to change the selection", function() {
            this.selection.select("theOther");
            expect(this.selection.selection.value).to.eql({selectedEntity: "theOther", entity : null});
        });
    });

});
