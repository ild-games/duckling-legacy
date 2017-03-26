import {expect} from 'chai';

import {Box2} from '../../../duckling/math/box2';
import {resize} from '../../../duckling/entitysystem/services/resize';

const BOX10 : Box2 = {
    position : { x: 0, y: 0},
    dimension : { x: 10, y: 10},
    rotation : 0
}

const BOX1 : Box2 = {
    position: {x: 0, y: 0},
    dimension: {x: 10, y:10},
    rotation: 0
}

const BOX5 : Box2 = {
    position: {x: 0, y: 0},
    dimension: {x: 5, y: 5},
    rotation: 0
}

describe("resize", function() {
    it("Returns the original box when the beforeDrag box equals the afterDrag box", function() {
        expect(resize(BOX10, BOX10, BOX1)).to.eql(BOX1);
    });

    it("boxToResize equals afterDrag if boxToResize equals beforeDrag", function() {
        let afterDrag = {...BOX1, position : {x: 5, y: 20}};
        expect(resize(BOX10, afterDrag, BOX10)).to.eql(afterDrag);
    });

    it("Can be used to move a box if the only change is position", function() {
        let afterDrag = {...BOX10, position : {x: 5, y: 20}};
        let result = {...BOX1, position: {x: 5, y: 20}};
        expect(resize(BOX10, afterDrag, BOX1)).to.eql(result);
    });

    it("Maintains the ratio between the left edge and the right edge when the rigth edge is extended", function() {
        // 6 - 2 - 2 => 12 - 4 - 4
        let afterDrag = {...BOX10, dimension: {x : 20, y: 10}};
        let box = {dimension : {x: 2, y: 2}, position : {x: 6, y : 5}, rotation: 0};
        let result = {dimension : {x: 4, y: 2}, position : {x: 12, y: 5}, rotation: 0};
        expect(resize(BOX10, afterDrag, box)).to.eql(result);
    });

    it("Maintains the ratio between the left edge and the right edge with the left edge is extended", function() {
        let afterDrag = {position: {x: -10, y: 0}, dimension: {x : 20, y: 10}, rotation: 0};
        let box = {dimension : {x: 2, y: 2}, position : {x: 6, y : 5}, rotation : 0};
        let result = {dimension : {x: 4, y: 2}, position : {x: 2, y: 5}, rotation : 0};
        expect(resize(BOX10, afterDrag, box)).to.eql(result);
    });

    it("Maitains the ratio between the top and bottom when the top is extended", function() {
        let afterDrag = {position: {y: -10, x: 0}, dimension: {y : 20,x: 10}, rotation: 0};
        let box = {dimension : {y: 2, x: 2}, position : {y: 6, x : 5}, rotation : 0};
        let result = {dimension : {y: 4, x: 2}, position : {y: 2, x: 5}, rotation : 0};
        expect(resize(BOX10, afterDrag, box)).to.eql(result);
    });

    it("Maintains the ratio between the top and bottom when the bottom is extended", function() {
        let afterDrag = {...BOX10, dimension: {y : 20, x: 10}};
        let box = {dimension : {x: 2, y: 2}, position : {y: 6, x : 5}, rotation : 0};
        let result = {dimension : {y: 4, x: 2}, position : {y: 12, x: 5}, rotation : 0};
        expect(resize(BOX10, afterDrag, box)).to.eql(result);
    });
});
