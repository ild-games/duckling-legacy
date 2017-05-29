import 'mocha';
import {expect} from 'chai';

import {CollisionTypesService, NONE_COLLISION_TYPE} from '../../../duckling/game/collision/collision-types.service';
import {COLLISION_KEY, defaultCollision} from '../../../duckling/game/collision/collision-attribute';
import {JsonLoaderService} from '../../../duckling/util/json-loader.service';
import {PathService} from '../../../duckling/util/path.service';
import {StoreService} from '../../../duckling/state';
import {Entity} from '../../../duckling/entitysystem/entity';
import {SnackBarService} from '../../../duckling/project/snackbar.service';
import {ProjectService} from '../../../duckling/project/project.service';
import {mainReducer} from '../../../duckling/main.reducer';
import {mergeEntityAction} from '../../../duckling/entitysystem';

class MockProjectService {
    getProjectMetaDataPath(metaData : string) : string{
        return `META_DATA_${metaData}`;
    }
}

describe("CollisionTypesService", function() {
    beforeEach(function() {
        let pathService = new PathService();
        let jsonLoaderService = new JsonLoaderService(pathService);
        this.storeService = new StoreService(mainReducer, mergeEntityAction);
        this.snackbarService = new SnackBarService();
        this.collisionTypesService = new CollisionTypesService(
            jsonLoaderService,
            this.storeService,
            new MockProjectService() as ProjectService,
            this.snackbarService);
    });

    it("puts new collision types in the store", function() {
        this.collisionTypesService.addCollisionType("collision-type1");
        expect(Array.from(this.storeService.state.getValue().collision.collisionTypes.values())).to.contain("collision-type1");
    });
    
    it("is aware of new collision types added", function() {
        this.collisionTypesService.addCollisionType("collision-type1");
        expect(Array.from(this.collisionTypesService.collisionTypes.getValue().values())).to.contain("collision-type1");
    });

    it("retrieve a collision type of 'none' on an entity that has the default collision", function() {
        let entity : Entity = {};
        entity[COLLISION_KEY] = defaultCollision;
        expect(this.collisionTypesService.getCollisionTypeForEntity(entity)).to.eql(NONE_COLLISION_TYPE);
    });

    it("retrieve the set collision type on an entity that has a non-default type", function() {
        let entity : Entity = {};
        entity[COLLISION_KEY] = {collisionType: "non-default"};
        expect(this.collisionTypesService.getCollisionTypeForEntity(entity)).to.eql("non-default");
    });

    it("returns null if asked to retrieve the collision type for an entity that does not have a collision attribute", function() {
        let entity : Entity = {};
        expect(this.collisionTypesService.getCollisionTypeForEntity(entity)).to.eql(null);
    });

    it("registers only the 'none' collision type when not given json stream of collision types", function() {
        (this.collisionTypesService as any)._registerAnconaCollisionTypes(null);
        expect(Array.from(this.collisionTypesService.collisionTypes.getValue().values())).to.eql(['none']);
    });

    it("registers only the 'none' collision type when given stream of collision types that does not contain none", function() {
        (this.collisionTypesService as any)._registerAnconaCollisionTypes({collisionTypes: ["custom-type"]});
        expect(Array.from(this.collisionTypesService.collisionTypes.getValue().values())).to.contain('none');
    });
    
    it("registers custom collision types when given json of collision types that does not contain none", function() {
        (this.collisionTypesService as any)._registerAnconaCollisionTypes({collisionTypes: ["custom-type1", "custom-type2"]});
        expect(Array.from(this.collisionTypesService.collisionTypes.getValue().values())).to.contain('custom-type1').and.to.contain('custom-type2');
    });

    it("can register multiple collision types at once", function() {
        (this.collisionTypesService as any)._registerCollisionTypes(["custom-type1", "custom-type2"]);
        expect(Array.from(this.collisionTypesService.collisionTypes.getValue().values())).to.contain('custom-type1').and.to.contain('custom-type2');
    });

    it("notifies the user with a snackbar when unknown collision types are found", function() {
        (this.collisionTypesService as any)._notifyUnknownCollisionTypes(["custom-type1", "custom-type2"]);
        expect((this.snackbarService as any)._snacks.length).to.eql(2);
    });

    it("does not notifies the user with a snackbar when unknown collision types are not found", function() {
        (this.collisionTypesService as any)._notifyUnknownCollisionTypes([]);
        expect((this.snackbarService as any)._snacks.length).to.eql(0);
    });

    it("notifies the user with a snackbar when the json file is malformed", function() {
        (this.collisionTypesService as any)._notifyFileError("File error");
        expect((this.snackbarService as any)._snacks.length).to.eql(1);
    });

    it("can find the unknown collision types from a given map", function() {
        this.collisionTypesService.addCollisionType("custom-type1");
        let map : any = {systems: {}};
        map.systems[COLLISION_KEY] = {
            components: {
                entity1: {
                    collisionType: 'custom-type1'
                },
                entity2: {
                    collisionType: 'custom-type2'
                }
            }
        }
        let unknownCollisionTypes = (this.collisionTypesService as any)._findUnknownCollisionTypes(map);
        expect(unknownCollisionTypes).to.eql(['custom-type2']);
    });

    it("can get the unique collision types in a given map", function() {
        let map : any = {systems: {}};
        map.systems[COLLISION_KEY] = {
            components: {
                entity1: {
                    collisionType: 'custom-type1'
                },
                entity2: {
                    collisionType: 'custom-type1'
                },
                entity3: {
                    collisionType: 'custom-type3'
                }
            }
        }
        let uniqueCollisionTypes = (this.collisionTypesService as any)._getUniqueCollisionTypesInRawMapFile(map);
        expect(uniqueCollisionTypes).to.eql(['custom-type1', 'custom-type3']);
    });
});