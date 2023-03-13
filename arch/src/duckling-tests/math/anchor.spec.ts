import { expect } from "chai";

import { anchorToPosition, positionToAnchor } from "../../duckling/math/anchor";

describe("anchorToPosition", function() {
    let vec = { x: 10, y: 5 };
    it("Can return a zero anchor", function() {
        expect(anchorToPosition({ x: 0, y: 0 }, vec)).to.eql({ x: -0, y: -0 });
    });

    it("Can calculate a positive anchor", function() {
        expect(anchorToPosition({ x: 0.5, y: -2 }, vec)).to.eql({
            x: -5,
            y: 10,
        });
    });
});

describe("positionToAnchor", function() {
    let vec = { x: 10, y: 5 };
    it("Can calculate a zero position", function() {
        expect(positionToAnchor({ x: 0, y: 0 }, vec)).to.eql({ x: -0, y: -0 });
    });

    it("Can calculate a positive position", function() {
        expect(positionToAnchor({ x: 5, y: -10 }, vec)).to.eql({
            x: -0.5,
            y: 2,
        });
    });

    it("Handles a zero width", function() {
        expect(positionToAnchor({ x: 10, y: 5 }, { x: 5, y: 0 })).to.eql({
            x: -2,
            y: 0,
        });
    });

    it("Handles a zero height", function() {
        expect(positionToAnchor({ x: 10, y: 5 }, { x: 0, y: 5 })).to.eql({
            x: 0,
            y: -1,
        });
    });
});
