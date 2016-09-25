import "reflect-metadata";
import 'mocha';
import {expect} from 'chai';

import {createStoreService, createEntityService} from '../helper/state';
import {EntitySystemService, EntityPositionSetService, EntityKey} from '../../duckling/entitysystem';
import {SelectionService, CopyPasteService} from '../../duckling/selection';
import {Vector} from '../../duckling/math';
import {immutableAssign} from '../../duckling/util';

class MockSetPositionService extends EntityPositionSetService {
    constructor(public entitySystemService : EntitySystemService) {
        super(entitySystemService);
    }

    setPosition(entityKey : EntityKey, newPosition : Vector, mergeKey? : any) {
        var entity = this.entitySystemService.getEntity(entityKey);
        var newEntity = immutableAssign(entity, {position : newPosition});
        this.entitySystemService.updateEntity(entityKey, newEntity, mergeKey);
    }
}

var entity = {
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
        this.selection = new SelectionService(this.store, this.entitySystem);
        this.setPosition = new MockSetPositionService(this.entitySystem);
        this.copyPaste = new CopyPasteService(this.store, this.entitySystem, this.selection, this.setPosition);
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
            var key = this.copyPaste.paste(this.newPosition);
            var entity = this.entitySystem.getEntity(key);
            expect(entity).to.eql(this.movedEntity);
        });

        it("with an empty clipboard does not creat an entity", function() {
            var systemSize = size(this.entitySystem);
            this.copyPaste.paste(this.newPosition);
            expect(size(this.entitySystem)).to.eql(systemSize++);
        });

        it("with an empty clipboard returns null", function() {
            var systemSize = size(this.entitySystem);
            expect(this.copyPaste.paste(this.newPosition)).to.eql(null);
        });

        it("can be undone with one call to undo", function() {
            this.copyPaste.copy(ENTITY_KEY);
            var key = this.copyPaste.paste(this.newPosition);
            this.store.undo();
            expect(!!this.entitySystem.getEntity(key)).not.to.eql(true);
        });
    });
});
