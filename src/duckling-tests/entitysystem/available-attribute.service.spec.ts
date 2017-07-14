import "reflect-metadata";
import 'mocha';
import {expect} from 'chai';
import {BehaviorSubject} from 'rxjs';

import {AvailableAttributeService, AttributeDefaultService} from '../../duckling/entitysystem';
import {Project} from '../../duckling/project/project';
import {ProjectService} from '../../duckling/project/project.service';
import {JsonSchema} from '../../duckling/util/json-schema';

const POS = "position";
const COL = "collision";
const DRAW = "drawable";
const CUSTOM_ONE = "custom-attribute1";
const CUSTOM_TWO = "custom-attribute2";

function sort(array : any[]) {
    array.sort();
    return array;
}

class MockProjectService {
    project = new BehaviorSubject<Project>({
        customAttributes: [],
        userMetaData: {
            mapMetaData: {}
        }
    });

    addCustomAttribute(key : string, content : JsonSchema) {
        this.project.getValue().customAttributes.push({key, content});
    }
}

describe("AvailableAttributeService", function() {
    beforeEach(function() {
        let attributeDefault = new AttributeDefaultService();
        attributeDefault.register(POS, {default : null});
        attributeDefault.register(COL, {default : null});
        attributeDefault.register(DRAW, {default : null});
        let projectService = new MockProjectService() as ProjectService;
        projectService.addCustomAttribute(CUSTOM_ONE, {});
        projectService.addCustomAttribute(CUSTOM_TWO, {});

        this.available = new AvailableAttributeService(attributeDefault, projectService);
    });

    it("called with no entity returns the available attributes", function() {
        expect(sort(this.available.availableAttributes())).to.eql(sort([POS, COL, DRAW, CUSTOM_ONE, CUSTOM_TWO]));
    });

    it("called with a partial entity returns the availble attributes", function() {
        let entity : any = {};
        entity[POS] = {};
        entity[CUSTOM_ONE] = {};
        expect(sort(this.available.availableAttributes(entity))).to.eql(sort([COL, DRAW, CUSTOM_TWO]));
    });

    it("called with a complete entity returns the empty array", function() {
        let entity : any = {};
        entity[POS] = {};
        entity[COL] = {};
        entity[DRAW] = {};
        entity[CUSTOM_ONE] = {};
        entity[CUSTOM_TWO] = {};
        expect(this.available.availableAttributes(entity)).to.eql([]);
    });
});
