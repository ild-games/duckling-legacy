import 'mocha';
import {expect} from 'chai';

import {_getDistance} from '../../../duckling/canvas/tools/_grid-snap';

describe("Grid snap _getDistance", function() {
    it("Snaps a small box correctly to the left edge", function() {
        expect(_getDistance(11, 1, 5)).to.eql(-0.5);
    });

    it("Snaps a small box correctly to the right edge", function() {
        expect(_getDistance(13, 1, 5)).to.eql(1.5);
    });

    it("Snaps a box larger than half the grid size to the left edge", function() {
        expect(_getDistance(12.75, 4, 5)).to.eql(0.25);
    });

    it("Snaps a box larger than half the grid size to the right edge", function() {
        expect(_getDistance(18.5, 4, 5)).to.eql(-0.5);
    });

    it("Snaps a box larger than the grid size to the left edge", function() {
        expect(_getDistance(11.5,12,5)).to.eql(-0.5);
    });

    it("Snaps a box smaller than the grid size to the right edge", function() {
        expect(_getDistance(13.5,12,5)).to.eql(0.5);
    });
});
