import 'mocha';
import {expect} from 'chai';
import {Box2, boxContainsPoint, Vector, boxFromEdges, boxUnion} from '../../duckling/math';

function squareVector(size : number) : Vector {
    return {x: size, y: size};
}

function squareBox(size : number) : Box2 {
    return {
        position : squareVector(0),
        dimension : squareVector(size),
        rotation: 0
    }
}

var yDIR = [0, -1, 0, 1];
var xDIR = [1, 0, -1, 0];

describe("Box2", function() {
    describe("boxContainsPoint", function() {
        it("returns false when the box is null ", function() {
            expect(boxContainsPoint(null, squareVector(0))).to.eql(false);
        });

        it("returns false when the position is null ", function() {
            expect(boxContainsPoint(squareBox(10), null)).to.eql(false);
        });

        it("a box at origin contains origin", function() {
            expect(boxContainsPoint(squareBox(10), squareVector(0))).to.eql(true);
        });

        it("an empty box at origin contains origin", function() {
            expect(boxContainsPoint(squareBox(0), squareVector(0))).to.eql(true);
        });

        it("a box centered on origin behaves correctly in all directions", function() {
            var box = squareBox(10);
            var inside = 4.9;
            var outside = 5.1;
            for (var xdir of xDIR) {
                for (var ydir of yDIR) {
                    expect(boxContainsPoint(box, {x : xdir*inside, y : ydir*inside})).to.eql(true);

                    if (xdir || ydir) {
                        expect(boxContainsPoint(box, {x : xdir*outside, y : ydir*outside})).to.eql(false);
                    }
                }
            }
        });
    });

    describe("boxFromEdges", function() {
        it("box.position.x to be the min and max if they are the same", function() {
            var box = boxFromEdges(10, 10, 5, 5);
            expect(box.position.x).to.eql(10);
        });

        it("gives box.position.y to be the min and max if they are the same", function() {
            var box = boxFromEdges(10, 10, 5, 5);
            expect(box.position.y).to.eql(5);
        });

        it("gives box.dimension.x should be the distance between the min and max", function() {
            var box = boxFromEdges(10, 23, 5, 5);
            expect(box.dimension.x).to.eql(13);
        });

        it("gives box.dimension.y should be the distance between the min and max", function() {
            var box = boxFromEdges(10, 23, 5, 17);
            expect(box.dimension.y).to.eql(12);
        });

        it("box.position.x is half way between the min and max", function() {
            var box = boxFromEdges(10, 22, 5, 5);
            expect(box.position.x).to.eql(16);
        });

        it("box.position.y is half way between the min and max", function() {
            var box = boxFromEdges(10, 22, 5, 16);
            expect(box.position.y).to.eql(10.5);
        });

        it("box.rotation to be 0", function() {
            var box = boxFromEdges(10, 22, 5, 16);
            expect(box.rotation).to.eql(0);
        });
    });

    describe("boxUnion", function() {
        it("Two identical boxes produce the same box", function() {
            let box1 = {
                position: { x: 0, y: 0},
                dimension: { x: 10, y: 10},
                rotation: 0
            }
            let box2 = {
                position: { x: 0, y: 0},
                dimension: { x: 10, y: 10},
                rotation: 0
            }
            expect(boxUnion(box1, box2)).to.eql({
                position: { x: 0, y: 0},
                dimension: { x: 10, y: 10},
                rotation: 0
            });
        });
        it("A box fully containing another produces the outer box", function() {
            let box1 = {
                position: { x: 0, y: 0},
                dimension: { x: 10, y: 10},
                rotation: 0
            }
            let box2 = {
                position: { x: 0, y: 0},
                dimension: { x: 9, y: 9},
                rotation: 0
            }
            let result = boxUnion(box1, box2);
            expect(boxUnion(box1, box2)).eql({
                position: { x: 0, y: 0},
                dimension: { x: 10, y: 10},
                rotation: 0
            });
        });
        it("Two boxes disconnected from each other produce a box surrounding both box's boundaries", function() {
            let box1 = {
                position: { x: 0, y: 0},
                dimension: { x: 10, y: 10},
                rotation: 0
            }
            let box2 = {
                position: { x: 20, y: 20},
                dimension: { x: 10, y: 10},
                rotation: 0
            }
            let result = boxUnion(box1, box2);
            expect(boxUnion(box1, box2)).eql({
                position: { x: 10, y: 10},
                dimension: { x: 30, y: 30},
                rotation: 0
            });
        });
    });
});
