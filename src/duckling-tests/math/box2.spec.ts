import {Box2, boxContainsPoint, Vector, boxFromEdges} from '../../duckling/math';

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
            expect(boxContainsPoint(null, squareVector(0))).toBe(false);
        });

        it("returns false when the position is null ", function() {
            expect(boxContainsPoint(squareBox(10), null)).toBe(false);
        });

        it("a box at origin contains origin", function() {
            expect(boxContainsPoint(squareBox(10), squareVector(0))).toBe(true);
        });

        it("an empty box at origin contains origin", function() {
            expect(boxContainsPoint(squareBox(0), squareVector(0))).toBe(true);
        });

        it("a box centered on origin behaves correctly in all directions", function() {
            var box = squareBox(10);
            var inside = 4.9;
            var outside = 5.1;
            for (var xdir of xDIR) {
                for (var ydir of yDIR) {
                    expect(boxContainsPoint(box, {x : xdir*inside, y : ydir*inside})).toBe(true);

                    if (xdir || ydir) {
                        expect(boxContainsPoint(box, {x : xdir*outside, y : ydir*outside})).toBe(false);
                    }
                }
            }
        });
    });

    describe("boxFromEdges", function() {
        it("box.position.x to be the min and max if they are the same", function() {
            var box = boxFromEdges(10, 10, 5, 5);
            expect(box.position.x).toBe(10);
        });

        it("gives box.position.y to be the min and max if they are the same", function() {
            var box = boxFromEdges(10, 10, 5, 5);
            expect(box.position.y).toBe(5);
        });

        it("gives box.dimension.x should be the distance between the min and max", function() {
            var box = boxFromEdges(10, 23, 5, 5);
            expect(box.dimension.x).toBe(13);
        });

        it("gives box.dimension.y should be the distance between the min and max", function() {
            var box = boxFromEdges(10, 23, 5, 17);
            expect(box.dimension.y).toBe(12);
        });

        it("box.position.x is half way between the min and max", function() {
            var box = boxFromEdges(10, 22, 5, 5);
            expect(box.position.x).toBe(16);
        });

        it("box.position.y is half way between the min and max", function() {
            var box = boxFromEdges(10, 22, 5, 16);
            expect(box.position.y).toBe(10.5);
        });

        it("box.rotation to be 0", function() {
            var box = boxFromEdges(10, 22, 5, 16);
            expect(box.rotation).toBe(0);
        });
    });

    describe("boxUnion", function() {
    });
});
