import 'mocha';
import {expect} from 'chai';
import {isInteger, isNumber, degreesToRadians, radiansToDegrees} from '../../duckling/math/number-utils';

describe("isInteger", function() {
    it("0 is an integer", function() {
        expect(isInteger(0)).to.eql(true);
    });

    it("-3 is an integer", function() {
        expect(isInteger(-3)).to.eql(true);
    });

    it("1.5 is not an integer", function() {
        expect(isInteger(1.5)).to.eql(false);
    });

    it("null is not an integer", function() {
        expect(isInteger(null)).to.eql(false);
    });

    it("the empty string is not an integer", function() {
        expect(isInteger("")).to.eql(false);
    });

    it("undefined is not an integer", function() {
        expect(isInteger(undefined)).to.eql(false);
    });
});

describe("isNumber", function() {
    it("0 is a number", function() {
        expect(isNumber(0)).to.eql(true);
    });

    it("-3 is a number", function() {
        expect(isNumber(-3)).to.eql(true);
    });

    it("1.5 is a number", function() {
        expect(isNumber(1.5)).to.eql(true);
    });

    it("null is not a number", function() {
        expect(isNumber(null)).to.eql(false);
    });

    it("the empty string is not a number", function() {
        expect(isNumber("")).to.eql(false);
    });

    it("undefined is not a number", function() {
        expect(isNumber(undefined)).to.eql(false);
    });

    it("infinity is not a number", function() {
        expect(isNumber(Infinity)).to.eql(false);
    });

    it("NaN is not a number", function() {
        expect(isNumber(NaN)).to.eql(false);
    });
});

describe("degreesToRadians", function() {
    it("handles 0", function() {
        expect(degreesToRadians(0)).to.eql(0);
    });

    it("handles 90", function() {
        expect(degreesToRadians(90)).to.eql(Math.PI / 2);
    });

    it("handles 180", function() {
        expect(degreesToRadians(180)).to.eql(Math.PI);
    });

    it("handles 270", function() {
        expect(degreesToRadians(270)).to.eql(Math.PI + Math.PI / 2);
    });

    it("handles 360", function() {
        expect(degreesToRadians(360)).to.eql(Math.PI * 2);
    });

    it("handles over 360", function() {
        expect(degreesToRadians(450)).to.eql((Math.PI * 2) + (Math.PI / 2));
    });

    it("handles negatives", function() {
        expect(degreesToRadians(-90)).to.eql(-Math.PI / 2);
    });
});

describe("radiansToDegrees", function() {
    it("handles 0", function() {
        expect(radiansToDegrees(0)).to.eql(0);
    });

    it("handles 90", function() {
        expect(radiansToDegrees(Math.PI / 2)).to.eql(90);
    });

    it("handles 180", function() {
        expect(radiansToDegrees(Math.PI)).to.eql(180);
    });

    it("handles 270", function() {
        expect(radiansToDegrees(Math.PI + Math.PI / 2)).to.eql(270);
    });

    it("handles 360", function() {
        expect(radiansToDegrees(Math.PI * 2)).to.eql(360);
    });

    it("handles over 360", function() {
        expect(radiansToDegrees((Math.PI * 2) + (Math.PI / 2))).to.eql(450);
    });

    it("handles negatives", function() {
        expect(degreesToRadians(-90)).to.eql(-Math.PI / 2);
        expect(radiansToDegrees(-Math.PI / 2)).to.eql(-90);
    });
});
