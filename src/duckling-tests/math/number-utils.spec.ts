import {isInteger, isNumber, degreesToRadians, radiansToDegrees} from '../../duckling/math/number-utils';

describe("isInteger", function() {
    it("0 is an integer", function() {
        expect(isInteger(0)).toBe(true);
    });

    it("-3 is an integer", function() {
        expect(isInteger(-3)).toBe(true);
    });

    it("1.5 is not an integer", function() {
        expect(isInteger(1.5)).toBe(false);
    });

    it("null is not an integer", function() {
        expect(isInteger(null)).toBe(false);
    });

    it("the empty string is not an integer", function() {
        expect(isInteger("")).toBe(false);
    });

    it("undefined is not an integer", function() {
        expect(isInteger(undefined)).toBe(false);
    });
});

describe("isNumber", function() {
    it("0 is a number", function() {
        expect(isNumber(0)).toBe(true);
    });

    it("-3 is a number", function() {
        expect(isNumber(-3)).toBe(true);
    });

    it("1.5 is a number", function() {
        expect(isNumber(1.5)).toBe(true);
    });

    it("null is not a number", function() {
        expect(isNumber(null)).toBe(false);
    });

    it("the empty string is not a number", function() {
        expect(isNumber("")).toBe(false);
    });

    it("undefined is not a number", function() {
        expect(isNumber(undefined)).toBe(false);
    });

    it("infinity is not a number", function() {
        expect(isNumber(Infinity)).toBe(false);
    });

    it("NaN is not a number", function() {
        expect(isNumber(NaN)).toBe(false);
    });
});

describe("degreesToRadians", function() {
    it("handles 0", function() {
        expect(degreesToRadians(0)).toBe(0);
    });

    it("handles 90", function() {
        expect(degreesToRadians(90)).toBe(Math.PI / 2);
    });

    it("handles 180", function() {
        expect(degreesToRadians(180)).toBe(Math.PI);
    });

    it("handles 270", function() {
        expect(degreesToRadians(270)).toBe(Math.PI + Math.PI / 2);
    });

    it("handles 360", function() {
        expect(degreesToRadians(360)).toBe(Math.PI * 2);
    });

    it("handles over 360", function() {
        expect(degreesToRadians(450)).toBe((Math.PI * 2) + (Math.PI / 2));
    });

    it("handles negatives", function() {
        expect(degreesToRadians(-90)).toBe(-Math.PI / 2);
    });
});

describe("radiansToDegrees", function() {
    it("handles 0", function() {
        expect(radiansToDegrees(0)).toBe(0);
    });

    it("handles 90", function() {
        expect(radiansToDegrees(Math.PI / 2)).toBe(90);
    });

    it("handles 180", function() {
        expect(radiansToDegrees(Math.PI)).toBe(180);
    });

    it("handles 270", function() {
        expect(radiansToDegrees(Math.PI + Math.PI / 2)).toBe(270);
    });

    it("handles 360", function() {
        expect(radiansToDegrees(Math.PI * 2)).toBe(360);
    });

    it("handles over 360", function() {
        expect(radiansToDegrees((Math.PI * 2) + (Math.PI / 2))).toBe(450);
    });

    it("handles negatives", function() {
        expect(degreesToRadians(-90)).toBe(-Math.PI / 2);
        expect(radiansToDegrees(-Math.PI / 2)).toBe(-90);
    });
});
