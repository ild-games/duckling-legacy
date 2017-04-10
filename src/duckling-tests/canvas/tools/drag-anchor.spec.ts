import {expect} from 'chai';
import {Box2} from '../../../duckling/math/box2';
import {vectorMultiply} from '../../../duckling/math/vector';
import {DRAG_ANCHORS, DragAnchor, anchorContainsPoint, getAnchorPosition, getResizeFromDrag} from '../../../duckling/canvas/tools/drag-anchor';

let BOTTOM_RIGHT_ANCHOR : DragAnchor = {
    location : {x: 1, y: 1},
    dimension : {x: 2, y: 3},
    rotation: 0
};

let RECTANGLE : Box2 = {
    position : {
        x: 10,
        y: 20
    },
    dimension : {
        x: 5,
        y: 10
    },
    rotation: 0
}

describe("anchorContainsPoint", function() {
    describe("when called on unrotated anchors", function() {
        let position = getAnchorPosition(RECTANGLE, BOTTOM_RIGHT_ANCHOR);
        it("handles points that are outside of it", function() {
            expect(anchorContainsPoint(RECTANGLE, BOTTOM_RIGHT_ANCHOR, {x: 14, y: 30}, 1)).to.eql(false);
        });

        it("handles points that are inside of it", function() {
            expect(anchorContainsPoint(RECTANGLE, BOTTOM_RIGHT_ANCHOR, {x: 16, y: 31}, 1)).to.eql(true);
        });

        it("the position of the anchor is inside the anchor", function() {
            expect(anchorContainsPoint(RECTANGLE, BOTTOM_RIGHT_ANCHOR, getAnchorPosition(RECTANGLE, BOTTOM_RIGHT_ANCHOR), 1)).to.eql(true);
        });
    });

    describe("when called on rotated anchors", function() {
        let ROTATED_ANCHOR = {...BOTTOM_RIGHT_ANCHOR, rotation: Math.PI * 0.25};
        it("handles points that are outside of it", function() {
            expect(anchorContainsPoint(RECTANGLE, ROTATED_ANCHOR, {x: 15 + 2, y: 30 + 1.5}, 1)).to.eql(false);
        });

        it("handles points that are inside of it", function() {
            expect(anchorContainsPoint(RECTANGLE, ROTATED_ANCHOR, {x: 15 - 0.205, y: 30 + 1.7}, 1)).to.eql(true);
        });

        it("handles points that are inside of it with scale", function() {
            let anchor : DragAnchor = { ...ROTATED_ANCHOR, dimension : vectorMultiply(ROTATED_ANCHOR.dimension, {x: 2, y: 2})};
            expect(anchorContainsPoint(RECTANGLE, anchor, {x: 15 - 0.205, y: 30 + 1.7}, 0.5)).to.eql(true);
        });

        it("the position of the anchor is inside the anchor", function() {
            expect(anchorContainsPoint(RECTANGLE, ROTATED_ANCHOR, getAnchorPosition(RECTANGLE, BOTTOM_RIGHT_ANCHOR), 1)).to.eql(true);
        });
    });
});

function anchor(x : number, y : number) : DragAnchor {
    return {
        location : { x, y},
        dimension : null,
        rotation : null
    };
}

describe("getResizeFromDrag", function() {
    it("Drag to the right", function() {
        expect(getResizeFromDrag(
            RECTANGLE,
            anchor(1, 0.5),
            {x: 10, y: 20},
            {x: 20, y: 40}
        )).to.eql({...RECTANGLE, dimension: {x: 15, y: 10}});
    });

    it("Drag down", function() {
        debugger;
        expect(getResizeFromDrag(
            RECTANGLE,
            anchor(0.5, 1),
            {x: 10, y: 20},
            {x: 20, y: 40}
        )).to.eql({...RECTANGLE, dimension: {x: 5, y: 30}});
    });

    it("Drag to the bottom right", function() {
        debugger;
        expect(getResizeFromDrag(
            RECTANGLE,
            anchor(1, 1),
            {x: 10, y: 20},
            {x: 20, y: 40}
        )).to.eql({...RECTANGLE, dimension: {x: 15, y: 30}});
    });

    it("Drag to the top left", function() {
        debugger;
        expect(getResizeFromDrag(
            RECTANGLE,
            anchor(0, 0),
            {x: 10, y: 20},
            {x: 8, y: 15}
        )).to.eql({...RECTANGLE, position: {x: 8, y: 15}, dimension: {x: 7, y: 15}});
    });
});
