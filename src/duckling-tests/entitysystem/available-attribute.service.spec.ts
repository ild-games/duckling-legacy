import "reflect-metadata";
import 'mocha';
import {expect} from 'chai';

import {AvailableAttributeService, AttributeDefaultService} from '../../duckling/entitysystem';

const POS = "position";
const COL = "collision";
const DRAW = "drawable";

function sort(array : any[]) {
    array.sort();
    return array;
}

describe("AvailableAttributeService", function() {
    beforeEach(function() {
        let attributeDefault = new AttributeDefaultService();
        attributeDefault.register(POS, {});
        attributeDefault.register(COL, {});
        attributeDefault.register(DRAW, {});

        this.available = new AvailableAttributeService(attributeDefault);
    });

    it("called with no entity returns the available attributes", function() {
        expect(sort(this.available.availableAttributes())).to.eql(sort([POS, COL, DRAW]));
    });

    it("called with a partial entity returns the availble attributes", function() {
        let entity : any = {};
        entity[POS] = {};
        expect(sort(this.available.availableAttributes(entity))).to.eql(sort([COL, DRAW]));
    });

    it("called with a complete entity returns the empty array", function() {
        let entity : any = {};
        entity[POS] = {};
        entity[COL] = {};
        entity[DRAW] = {};
        expect(this.available.availableAttributes(entity)).to.eql([]);
    });
});
