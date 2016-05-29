import "reflect-metadata";

import {createStoreService, createEntityService} from '../helper/state';
import {SelectionService} from '../../duckling/selection';
import {immutableAssign} from '../../duckling/util';

var entity = {
    foo : {
        bar : "atone"
    }
};
const ENTITY_KEY = "theEntity";

describe("SelectionService", function() {
    beforeEach(function() {
        this.store = createStoreService();
        this.entitySystem = createEntityService(this.store);
        this.selection = new SelectionService(this.store, this.entitySystem);
    });

    it("with no selection, the selction behavior is empty", function() {
        expect(this.selection.selection.value).toEqual({});
    });

    it("can make a selection even if the entity does not exist", function() {
        this.selection.select(ENTITY_KEY);
        expect(this.selection.selection.value).toEqual({selectedEntity: ENTITY_KEY, entity : null});
    });

    it("creating an already selected entity will update the selection", function() {
        this.selection.select(ENTITY_KEY);
        this.entitySystem.updateEntity(ENTITY_KEY, entity);
        expect(this.selection.selection.value).toEqual({selectedEntity: ENTITY_KEY, entity});
    });

    describe("with a selected entity", function() {
        beforeEach(function() {
            this.entitySystem.updateEntity(ENTITY_KEY, entity);
            this.selection.select(ENTITY_KEY);
        });

        it("updating an already selected entity will update the selection", function() {
            var newEntity = immutableAssign(entity, {compa : {tr : "umpet"}});
            this.entitySystem.updateEntity(ENTITY_KEY, newEntity);
            var selection = {
                selectedEntity : ENTITY_KEY,
                entity : newEntity
            }
            expect(this.selection.selection.value).toEqual(selection);
        });

        it("it is possible to change the selection", function() {
            this.selection.select("theOther");
            expect(this.selection.selection.value).toEqual({selectedEntity: "theOther", entity : null});
        });
    });

});
