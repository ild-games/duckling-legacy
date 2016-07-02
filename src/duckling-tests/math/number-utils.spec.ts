import {isInteger, isNumber} from '../../duckling/math/number-utils';

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
