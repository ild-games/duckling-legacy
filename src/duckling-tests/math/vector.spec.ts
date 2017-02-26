import 'mocha';
import {expect} from 'chai';
import {
    vectorAdd, 
    vectorSubtract, 
    vectorRound, 
    vectorRotate
} from '../../duckling/math';

describe("vectorAdd", function() {
    it("{1, 1} + {1, 1} = {2, 2}", function() {
        expect(vectorAdd({x: 1, y: 1}, {x: 1, y: 1})).to.eql({x: 2, y: 2});
    });

    it("{1, 1} + {-1, 1} = {0, 2}", function() {
        expect(vectorAdd({x: 1, y: 1}, {x: -1, y: 1})).to.eql({x: 0, y: 2});
    });

    it("{0, 0} + {-1, -1} = {-1, -1}", function() {
        expect(vectorAdd({x: 0, y: 0}, {x: -1, y: -1})).to.eql({x: -1, y: -1});
    });

    it("{0, 0} + {0, 0} = {0, 0}", function() {
        expect(vectorAdd({x: 0, y: 0}, {x: 0, y: 0})).to.eql({x: 0, y: 0});
    });
});

describe("vectorSubtract", function() {
    it("{1, 1} - {1, 1} = {0, 0}", function() {
        expect(vectorSubtract({x: 1, y: 1}, {x: 1, y: 1})).to.eql({x: 0, y: 0});
    });

    it("{1, 1} - {-1, 1} = {2, 0}", function() {
        expect(vectorSubtract({x: 1, y: 1}, {x: -1, y: 1})).to.eql({x: 2, y: 0});
    });

    it("{0, 0} - {-1, -1} = {1, 1}", function() {
        expect(vectorSubtract({x: 0, y: 0}, {x: -1, y: -1})).to.eql({x: 1, y: 1});
    });

    it("{0, 0} - {0, 0} = {0, 0}", function() {
        expect(vectorSubtract({x: 0, y: 0}, {x: 0, y: 0})).to.eql({x: 0, y: 0});
    });
});

describe("vectorRound", function() {
    it("{1.5, 1.5} = {2, 2}", function() {
        expect(vectorRound({x: 1.5, y: 1.5})).to.eql({x: 2, y: 2});
    });

    it("{1.49, 1.49} = {1, 1}", function() {
        expect(vectorRound({x: 1.49, y: 1.49})).to.eql({x: 1, y: 1});
    });

    it("{-1.5, -1.5} = {-1, -1}", function() {
        expect(vectorRound({x: -1.5, y: -1.5})).to.eql({x: -1, y: -1});
    });

    it("{-1.49, -1.49} = {-1, -1}", function() {
        expect(vectorRound({x: -1.49, y: -1.49})).to.eql({x: -1, y: -1});
    });

    it("{1, 1} = {1, 1}", function() {
        expect(vectorRound({x: 1, y: 1})).to.eql({x: 1, y: 1});
    });
});

describe("vectorRotate", function() {
    it("{0, 1} rotated 0 degrees = {0, 1}", function() {
        let rotatedVector = vectorRotate({x: 0, y: 1}, 0);
        expect(rotatedVector.x).to.be.closeTo(0, 0.001);
        expect(rotatedVector.y).to.be.closeTo(1, 0.001);
    });
    
    it("{0, 1} rotated 90 degrees = {-1, 0}", function() {
        let rotatedVector = vectorRotate({x: 0, y: 1}, Math.PI / 2);
        expect(rotatedVector.x).to.be.closeTo(-1.0, 0.001);
        expect(rotatedVector.y).to.be.closeTo(0, 0.001);
    });
    
    it("{0, 1} rotated 180 degrees = {0, -1}", function() {
        let rotatedVector = vectorRotate({x: 0, y: 1}, Math.PI);
        expect(rotatedVector.x).to.be.closeTo(0, 0.001);
        expect(rotatedVector.y).to.be.closeTo(-1, 0.001);
    });
    
    it("{0, 1} rotated 270 degrees = {1, 0}", function() {
        let rotatedVector = vectorRotate({x: 0, y: 1}, Math.PI + (Math.PI / 2));
        expect(rotatedVector.x).to.be.closeTo(1, 0.001);
        expect(rotatedVector.y).to.be.closeTo(0, 0.001);
    });
    
    it("{0, 1} rotated 360 degrees = {0, 1}", function() {
        let rotatedVector = vectorRotate({x: 0, y: 1}, Math.PI * 2);
        expect(rotatedVector.x).to.be.closeTo(0, 0.001);
        expect(rotatedVector.y).to.be.closeTo(1, 0.001);
    });
    
    it("{0, 1} rotated 90 degrees around point {0, 0.5} = {-0.5, 0.5}", function() {
        let rotatedVector = vectorRotate({x: 0, y: 1}, Math.PI / 2, {x: 0, y: 0.5});
        expect(rotatedVector.x).to.be.closeTo(-0.5, 0.001);
        expect(rotatedVector.y).to.be.closeTo(0.5, 0.001);
    });
});