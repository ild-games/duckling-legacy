import "reflect-metadata";

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
        var attributeDefault = new AttributeDefaultService();
        attributeDefault.register(POS, {});
        attributeDefault.register(COL, {});
        attributeDefault.register(DRAW, {});

        this.available = new AvailableAttributeService(attributeDefault);
    });

    it("called with no entity returns the available attributes", function() {
        expect(sort(this.available.availableAttributes())).toEqual(sort([POS, COL, DRAW]));
    });

    it("called with a partial entity returns the availble attributes", function() {
        var entity : any = {};
        entity[POS] = {};
        expect(sort(this.available.availableAttributes(entity))).toEqual(sort([COL, DRAW]));
    });

    it("called with a complete entity returns the empty array", function() {
        var entity : any = {};
        entity[POS] = {};
        entity[COL] = {};
        entity[DRAW] = {};
        expect(this.available.availableAttributes(entity)).toEqual([]);
    });
});
